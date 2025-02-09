'use server';
import { db } from '@/lib/db';
import { currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse, DailyProfit, DailyProfitAndSubOrders, DateRange, MonthlyProfitAndSubOrders } from '@/types';
import { UserRole } from '@prisma/client';
import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';
import { packOptions } from '@/lib/constants';

async function fetchBasicCounts(from: Date, to: Date) {
  return Promise.all([
    db.lead.count(),
    db.transaction.count({
      where: { createdAt: { gte: from, lte: to } },
    }),
    db.product.count(),
    db.user.count({ where: { role: UserRole.SUPPLIER } }),
    db.user.count({ where: { role: UserRole.SELLER } }),
  ]);
}

async function fetchBasicSellerCounts(id: string, from: Date, to: Date) {
  return Promise.all([
    db.transaction.count({
      where: { userId: id, createdAt: { gte: from, lte: to } },
    }),
    db.product.count({
      where: {
        sellers: {
          some: {
            id,
          },
        },
      },
    }),
    db.pickup.count({
      where: {
        subOrders: {
          some: {
            order: {
              sellerId: id,
            },
          },
        },
      },
    }),
  ]);
}

async function fetchBasicSupplierCounts(id: string, from: Date, to: Date) {
  return Promise.all([
    db.transaction.count({
      where: { userId: id, createdAt: { gte: from, lte: to } },
    }),
    db.product.count({
      where: {
        supplierId: id,
      },
    }),
    db.pickup.count({
      where: {
        subOrders: {
          some: {
            products: {
              some: {
                product: {
                  supplierId: id,
                },
              },
            },
          },
        },
      },
    }),
  ]);
}

async function calculateMonthlyProfit() {
  return Promise.all(
    Array.from({ length: 6 })
      .map((_, index) => {
        const start = startOfMonth(subMonths(new Date(), index));
        const end = endOfMonth(subMonths(new Date(), index));
        return { start, end };
      })
      .reverse()
      .map(async ({ start, end }) => {
        // Fetch orders that are relevant for the calculation
        const orders = await db.order.findMany({
          where: {
            createdAt: { gte: start, lte: end },
          },
          include: { subOrders: { include: { statusHistory: true } } },
        });

        // Calculate platform profit from orders
        const monthlyProfit = orders.reduce(
          (total, order) =>
            total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.platformProfit || 0), 0),
          0,
        );

        // Get the number of subOrders (deliveries)
        const subOrdersCount = orders.reduce((total, order) => total + order.subOrders.length, 0);

        // Get the number of sold courses in this period
        const soldCourses = await db.billing.findMany({
          where: {
            createdAt: { gte: start, lte: end },
          },
        });

        // Calculate course profit
        const courseProfit = soldCourses.reduce((total, course) => {
          switch (course.pack) {
            case packOptions.FREE:
              return total;
            case packOptions.DAMREJ:
              return total + 297;
            case packOptions.AJEJA:
              return total + 497;
            case packOptions.BRAND:
              return total + 1997;
            case packOptions.MACHROU3:
              return total + 3500;
            default:
              return total;
          }
        }, 0);

        // Total profit includes both platform profit and course profit
        const totalProfit = monthlyProfit + courseProfit;

        return {
          month: start.toLocaleString('default', { month: 'short' }),
          profit: totalProfit,
          subOrders: subOrdersCount,
          soldCourses: soldCourses.length, // Number of courses sold
        };
      }),
  );
}

async function calculateSellerMonthlyProfitAndSubOrders(id: string) {
  return Promise.all(
    Array.from({ length: 6 })
      .map((_, index) => {
        const start = startOfMonth(subMonths(new Date(), index));
        const end = endOfMonth(subMonths(new Date(), index));
        return { start, end };
      })
      .reverse()
      .map(async ({ start, end }) => {
        const orders = await db.order.findMany({
          where: {
            sellerId: id,
            createdAt: { gte: start, lte: end },
          },
          include: { subOrders: { include: { statusHistory: true } } },
        });

        const monthlyProfit = orders.reduce(
          (total, order) =>
            total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.sellerProfit || 0), 0),
          0,
        );

        const subOrdersCount = orders.reduce((total, order) => total + order.subOrders.length, 0);

        return {
          month: start.toLocaleString('default', { month: 'short' }),
          profit: monthlyProfit,
          subOrders: subOrdersCount,
        };
      }),
  );
}

async function calculateSupplierMonthlyProfitAndSubOrders(id: string) {
  return Promise.all(
    Array.from({ length: 6 }) // Generate last 6 months
      .map((_, index) => {
        const start = startOfMonth(subMonths(new Date(), index));
        const end = endOfMonth(subMonths(new Date(), index));
        return { start, end };
      })
      .reverse() // Ensure chronological order
      .map(async ({ start, end }) => {
        const subOrders = await db.subOrder.findMany({
          where: {
            products: {
              some: {
                product: {
                  supplierId: id, // Filter for the supplier
                },
              },
            },
            order: {
              createdAt: { gte: start, lte: end }, // Filter by the date range
            },
          },
          include: {
            products: true, // Include products to access `supplierProfit`
          },
        });

        // Calculate profit and count subOrders
        const monthlyProfit = subOrders.reduce(
          (totalProfit, subOrder) =>
            totalProfit +
            subOrder.products.reduce(
              (productTotal, product) => productTotal + (product.supplierProfit || 0), // Sum supplier profits
              0,
            ),
          0,
        );

        const subOrdersCount = subOrders.length; // Count subOrders directly

        return {
          month: start.toLocaleString('default', { month: 'short' }), // Format month name
          profit: monthlyProfit,
          subOrders: subOrdersCount,
        };
      }),
  );
}

async function calculateDailyProfit() {
  // Get the current date and calculate the date 9 days before today
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 9); // Set 'from' to 9 days ago

  const to = today; // 'to' will be today

  // Fetch subOrders within the date range
  const dailySubOrders = await db.subOrder.findMany({
    where: {
      order: { createdAt: { gte: from, lte: to } },
    },
    include: {
      order: true,
    },
  });

  // Mapping of daily data by date
  const dailyDataMap: { [key: string]: { subOrders: Set<string>; profit: number; coursesSold: number } } = {};

  // Process each suborder
  for (const subOrder of dailySubOrders) {
    const dateStr = subOrder.order?.createdAt.toISOString().split('T')[0];
    if (!dateStr) continue;

    // Initialize data for this date if it doesn't exist
    if (!dailyDataMap[dateStr]) {
      dailyDataMap[dateStr] = { subOrders: new Set(), profit: 0, coursesSold: 0 };
    }

    // Add subOrder to the set of subOrders for the day
    dailyDataMap[dateStr].subOrders.add(subOrder.order!.id);

    // Add platform profit for the suborder
    dailyDataMap[dateStr].profit += subOrder.platformProfit || 0;
  }

  // Fetch the sold courses within the specified date range
  const soldCourses = await db.billing.findMany({
    where: {
      createdAt: { gte: from, lte: to },
    },
  });

  // Calculate course profit and count sold courses
  soldCourses.forEach((course) => {
    const dateStr = course.createdAt!.toISOString().split('T')[0];
    if (!dailyDataMap[dateStr]) {
      dailyDataMap[dateStr] = { subOrders: new Set(), profit: 0, coursesSold: 0 };
    }

    if (course.pack === 'FREE') {
      dailyDataMap[dateStr].profit += 0;
    } else if (course.pack === 'DAMREJ') {
      dailyDataMap[dateStr].profit += 297;
    } else if (course.pack === 'AJEJA') {
      dailyDataMap[dateStr].profit += 497;
    } else if (course.pack === 'BRAND') {
      dailyDataMap[dateStr].profit += 1997;
    } else if (course.pack === 'MACHROU3') {
      dailyDataMap[dateStr].profit += 3500;
    } else {
      dailyDataMap[dateStr].profit += 0;
    }

    // Count the number of courses sold
    dailyDataMap[dateStr].coursesSold += 1;
  });

  // Fill daily data with calculated profit and subOrder counts
  const filledDailyData: DailyProfit[] = [];
  let currentDate = new Date(from);
  while (currentDate <= to) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const data = dailyDataMap[dateStr];

    filledDailyData.push({
      date: dateStr,
      subOrders: data ? data.subOrders.size : 0,
      profit: parseFloat((data ? data.profit : 0).toFixed(2)),
      soldCourses: data ? data.coursesSold : 0, // Number of courses sold on this date
    });

    // Increment the current date by 1
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledDailyData;
}

async function calculateSellerDailyProfitAndSubOrders(id: string, from: Date, to: Date) {
  const dailySubOrders = await db.subOrder.findMany({
    where: {
      order: { sellerId: id, createdAt: { gte: from, lte: to } },
    },
    include: {
      order: { select: { createdAt: true, id: true } },
    },
  });

  const dailyDataMap: { [key: string]: { subOrders: Set<string>; profit: number } } = {};

  dailySubOrders.forEach((subOrder) => {
    const dateStr = subOrder.order?.createdAt.toISOString().split('T')[0];
    if (!dateStr) return;
    if (!dailyDataMap[dateStr]) {
      dailyDataMap[dateStr] = { subOrders: new Set(), profit: 0 };
    }
    if (subOrder.order) {
      dailyDataMap[dateStr].subOrders.add(subOrder.order.id);
    }
    dailyDataMap[dateStr].profit += subOrder.sellerProfit || 0;
  });

  const filledDailyData: DailyProfitAndSubOrders[] = [];
  let currentDate = new Date(from);
  while (currentDate <= to) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const data = dailyDataMap[dateStr];
    filledDailyData.push({
      date: dateStr,
      subOrders: data ? data.subOrders.size : 0,
      profit: parseFloat((data ? data.profit : 0).toFixed(2)),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledDailyData;
}

async function calculateSupplierDailyProfitAndSubOrders(id: string, from: Date, to: Date) {
  const dailySubOrders = await db.subOrder.findMany({
    where: {
      products: {
        some: {
          product: {
            supplierId: id, // Filter for the specific supplier's products
          },
        },
      },
      order: {
        createdAt: { gte: from, lte: to }, // Filter orders by the date range
      },
    },
    include: {
      order: { select: { createdAt: true, id: true } }, // Include order details for dates and IDs
      products: {
        select: {
          supplierProfit: true, // Correct field based on OrderProduct model
        },
      },
    },
  });

  // Map to store daily aggregated data
  const dailyDataMap: { [key: string]: { subOrders: Set<string>; profit: number } } = {};

  dailySubOrders.forEach((subOrder) => {
    const dateStr = subOrder.order?.createdAt?.toISOString().split('T')[0];
    if (!dateStr) return;

    // Initialize the date entry in the map if not present
    if (!dailyDataMap[dateStr]) {
      dailyDataMap[dateStr] = { subOrders: new Set(), profit: 0 };
    }

    // Add the subOrder ID to the set of subOrders for the day
    if (subOrder.order) {
      dailyDataMap[dateStr].subOrders.add(subOrder.order.id);
    }

    // Calculate profit for this subOrder from supplier's products
    const supplierProfit = subOrder.products.reduce((total, product) => {
      return total + (product.supplierProfit || 0); // Add supplierProfit if available
    }, 0);

    // Add the calculated profit to the daily map
    dailyDataMap[dateStr].profit += supplierProfit;
  });

  // Fill missing dates with zero values for continuity
  const filledDailyData: DailyProfitAndSubOrders[] = [];
  let currentDate = new Date(from);
  while (currentDate <= to) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const data = dailyDataMap[dateStr];
    filledDailyData.push({
      date: dateStr,
      subOrders: data ? data.subOrders.size : 0,
      profit: parseFloat((data ? data.profit : 0).toFixed(2)),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledDailyData;
}

async function fetchtopFiftyProducts(from: Date, to: Date) {
  const bestSellers = await db.orderProduct.findMany({
    where: {
      productId: { not: null },
      subOrder: {
        order: { createdAt: { gte: from, lte: to } },
      },
    },
    select: { productId: true, quantity: true },
  });

  const aggregated = bestSellers.reduce(
    (acc, item) => {
      const productId = item.productId!;
      const quantity = parseInt(item.quantity || '0', 10);
      if (!acc[productId]) {
        acc[productId] = { productId, totalQuantity: 0 };
      }
      acc[productId].totalQuantity += quantity;
      return acc;
    },
    {} as Record<string, { productId: string; totalQuantity: number }>,
  );

  return Promise.all(
    Object.values(aggregated)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 50)
      .map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, media: { select: { key: true } } },
        });
        return {
          id: product?.id,
          name: product?.name,
          media: product?.media[0]?.key,
          totalQuantity: item.totalQuantity,
        };
      }),
  );
}

async function fetchSellertopFiftyProducts(id: string, from: Date, to: Date) {
  const bestSellers = await db.orderProduct.findMany({
    where: {
      product: {
        sellers: {
          some: {
            id: id, // Filter products specifically linked to the seller
          },
        },
      },
      subOrder: {
        order: {
          sellerId: id, // Ensure the order belongs to the seller
          createdAt: { gte: from, lte: to }, // Filter by date range
        },
      },
    },
    select: {
      productId: true,
      quantity: true,
    },
  });

  // Aggregate quantities by product
  const aggregated = bestSellers.reduce(
    (acc, item) => {
      const productId = item.productId!;
      const quantity = parseInt(item.quantity || '0', 10); // Convert string quantity to number
      if (!acc[productId]) {
        acc[productId] = { productId, totalQuantity: 0 };
      }
      acc[productId].totalQuantity += quantity; // Sum the quantities
      return acc;
    },
    {} as Record<string, { productId: string; totalQuantity: number }>,
  );

  // Fetch product details for the top 5 products
  return Promise.all(
    Object.values(aggregated)
      .sort((a, b) => b.totalQuantity - a.totalQuantity) // Sort by quantity in descending order
      .slice(0, 50)
      .map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            media: {
              select: { key: true },
            },
          },
        });
        return {
          id: product?.id || item.productId,
          name: product?.name || 'Unknown Product',
          media: product?.media[0]?.key || '', // Use the first media key
          totalQuantity: item.totalQuantity,
        };
      }),
  );
}

async function fetchSuppliertopFiftyProducts(id: string, from: Date, to: Date) {
  const bestSellers = await db.orderProduct.findMany({
    where: {
      product: {
        supplierId: id,
      },
      subOrder: {
        products: {
          some: {
            product: {
              supplierId: id,
            },
          },
        },
        order: {
          createdAt: { gte: from, lte: to }, // Filter by date range
        },
      },
    },
    select: {
      productId: true,
      quantity: true,
    },
  });

  // Aggregate quantities by product
  const aggregated = bestSellers.reduce(
    (acc, item) => {
      const productId = item.productId!;
      const quantity = parseInt(item.quantity || '0', 10); // Convert string quantity to number
      if (!acc[productId]) {
        acc[productId] = { productId, totalQuantity: 0 };
      }
      acc[productId].totalQuantity += quantity; // Sum the quantities
      return acc;
    },
    {} as Record<string, { productId: string; totalQuantity: number }>,
  );

  return Promise.all(
    Object.values(aggregated)
      .sort((a, b) => b.totalQuantity - a.totalQuantity) // Sort by quantity in descending order
      .slice(0, 50)
      .map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            media: {
              select: { key: true },
            },
          },
        });
        return {
          id: product?.id || item.productId,
          name: product?.name || 'Unknown Product',
          media: product?.media[0]?.key || '', // Use the first media key
          totalQuantity: item.totalQuantity,
        };
      }),
  );
}

async function fetchtopFiftySellers(from: Date, to: Date) {
  const sellers = await db.subOrder.findMany({
    where: {
      order: {
        createdAt: { gte: from, lte: to },
      },
    },
    include: {
      order: { select: { sellerId: true } },
    },
  });

  const sellerCounts = sellers.reduce(
    (acc, item) => {
      const sellerId = item.order?.sellerId!;
      if (!acc[sellerId]) {
        acc[sellerId] = { sellerId, subOrderCount: 0 };
      }
      acc[sellerId].subOrderCount++;
      return acc;
    },
    {} as Record<string, { sellerId: string; subOrderCount: number }>,
  );

  return Promise.all(
    Object.values(sellerCounts)
      .sort((a, b) => b.subOrderCount - a.subOrderCount)
      .slice(0, 50)
      .map(async (item) => {
        const seller = await db.user.findUnique({
          where: { id: item.sellerId },
          select: { id: true, fullName: true, image: true },
        });
        return { id: seller?.id, name: seller?.fullName, media: seller?.image, totalQuantity: item.subOrderCount };
      }),
  );
}

export const adminGetStats = async (dateRange: DateRange): Promise<ActionResponse> => {
  const from = new Date(dateRange.from!.getTime() + 60 * 60 * 1000);
  const to = dateRange.to ? new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000 + 59 * 60 * 1000) : endOfDay(from);

  try {
    await roleGuard(UserRole.ADMIN);

    const [counts, monthlyData, dailyData, topFiftyProducts, topFiftySellers, subOrders, orders] = await Promise.all([
      fetchBasicCounts(from, to),
      calculateMonthlyProfit(),
      calculateDailyProfit(),
      fetchtopFiftyProducts(from, to),
      fetchtopFiftySellers(from, to),
      db.subOrder.findMany({
        where: {
          order: { createdAt: { gte: from, lte: to } },
        },
        include: { statusHistory: true },
      }),
      db.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        include: { subOrders: { include: { statusHistory: true } } },
      }),
    ]);

    const [leads, transactions, products, suppliers, sellers] = counts;

    const completedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => ['7', '23'].includes(history.status)),
    ).length;

    const cancelledSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === 'EC01'),
    ).length;
    const paidSubOrders = subOrders.filter((subOrder) =>
      ['23', 'EC02'].every((status) => subOrder.statusHistory.some((history) => history.status === status)),
    ).length;

    const returnedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === '25'),
    ).length;

    const platformOrderProfit = orders.reduce((total, order) => {
      const deliveredOrReturnedProfit = order.subOrders.reduce((subTotal, subOrder) => {
        const hasDeliveredOrReturnedStatus = subOrder.statusHistory?.some((history) =>
          ['7', '23', '25'].includes(history.status),
        );
        return hasDeliveredOrReturnedStatus ? subTotal + (subOrder.platformProfit || 0) : subTotal;
      }, 0);

      return total + deliveredOrReturnedProfit;
    }, 0);

    const soldCourses = db.billing.findMany({
      where: {
        createdAt: { gte: from, lte: to },
      },
    });

    const platformCourseProfit = (await soldCourses).reduce((total, course) => {
      if (course.pack === packOptions.FREE) {
        return total;
      } else if (course.pack === packOptions.DAMREJ) {
        return total + 297;
      } else if (course.pack === packOptions.AJEJA) {
        return total + 497;
      } else if (course.pack === packOptions.BRAND) {
        return total + 1997;
      } else if (course.pack === packOptions.MACHROU3) {
        return total + 3500;
      } else {
        return total;
      }
    }, 0);

    /* const totalSellerProfit = orders.reduce((total, order) => {
      return total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.sellerProfit || 0), 0);
    }, 0);
    */

    const cap = orders.reduce((total, order) => {
      return total + order.total;
    }, 0);

    const car = orders.reduce((total, order) => {
      const delivered = order.subOrders.some((subOrder) =>
        subOrder.statusHistory?.some((history) => ['7', '23'].includes(history.status)),
      );
      return delivered ? total + order.total : total;
    }, 0);
    const cae = orders.reduce((total, order) => {
      const deliveredProfit = order.subOrders.reduce((subTotal, subOrder) => {
        const hasDeliveredStatus = subOrder.statusHistory?.some((history) =>
          ['7', '23', '25'].includes(history.status),
        );
        return hasDeliveredStatus ? subTotal + (subOrder.platformProfit || 0) : subTotal;
      }, 0);

      const returnedCount = order.subOrders.filter((subOrder) =>
        subOrder.statusHistory?.some((history) => history.status === '25'),
      ).length;

      return total + deliveredProfit + returnedCount * 2.5;
    }, 0);

    const pendingSubOrders = subOrders.filter(
      (subOrder) =>
        !subOrder.statusHistory.some((history) =>
          ['7', '25', 'EC01', '16', '21', '22', '23', '26', '28', '27', '28', 'EC02', 'EC03'].includes(history.status),
        ),
    ).length;

    const pendingRevenue = subOrders
      .filter(
        (subOrder) =>
          !subOrder.statusHistory.some((history) =>
            ['7', '25', 'EC01', '16', '21', '22', '23', '26', '28', '27', '28', 'EC02', 'EC03'].includes(
              history.status,
            ),
          ),
      )
      .reduce((total, subOrder) => total + (subOrder.total || 0), 0);

    const cancelledRevenue = subOrders
      .filter((subOrder) => subOrder.statusHistory.some((history) => ['EC01'].includes(history.status)))
      .reduce((total, subOrder) => total + (subOrder.total || 0), 0);

    const returnedRevenue = subOrders
      .filter((subOrder) => subOrder.statusHistory.some((history) => ['25'].includes(history.status)))
      .reduce((total, subOrder) => total + (subOrder.total || 0), 0);

    return {
      success: 'stats-fetch-success',
      data: {
        leads,
        subOrders: subOrders.length,
        platformProfit: platformOrderProfit.toFixed(2),
        courseProfit: platformCourseProfit.toFixed(2),
        transactions,
        cap: cap.toFixed(2),
        car: car.toFixed(2),
        cae: cae.toFixed(2),
        completedSubOrders,
        pendingSubOrders,
        returnedSubOrders,
        paidSubOrders,
        cancelledSubOrders,
        pendingRevenue: pendingRevenue.toFixed(2),
        cancelledRevenue: cancelledRevenue.toFixed(2),
        returnedRevenue: returnedRevenue.toFixed(2),
        sellers,
        suppliers,
        products,
        monthlyProfit: monthlyData,
        dailyProfit: dailyData,
        topFiftyProducts,
        topFiftySellers,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'stats-fetch-error' };
  }
};

export const sellerGetStats = async (dateRange: DateRange): Promise<ActionResponse> => {
  const from = new Date(dateRange.from!.getTime() + 60 * 60 * 1000);
  const to = dateRange.to || endOfDay(from);

  try {
    await roleGuard(UserRole.SELLER);
    const user = await currentUser();
    const [counts, monthlyData, dailyData, topFiftyProducts, subOrders, orders] = await Promise.all([
      fetchBasicSellerCounts(user?.id!, from, to),
      calculateSellerMonthlyProfitAndSubOrders(user?.id!),
      calculateSellerDailyProfitAndSubOrders(user?.id!, startOfDay(subDays(new Date(), 10)), endOfDay(new Date())),
      fetchSellertopFiftyProducts(user?.id!, from, to),
      db.subOrder.findMany({
        where: {
          order: {
            sellerId: user?.id!,
            createdAt: { gte: from, lte: to },
          },
        },
        include: {
          statusHistory: true,
          products: {
            include: {
              product: true,
            },
          },
        },
      }),
      db.order.findMany({
        where: {
          sellerId: user?.id!,
          createdAt: { gte: from, lte: to },
        },
        include: {
          subOrders: {
            include: {
              products: {
                include: {
                  product: true,
                },
              },
              statusHistory: true,
            },
          },
        },
      }),
    ]);

    const [transactions, products, pickups] = counts;

    const cap = orders.reduce((total, order) => {
      const subOrdersTotal = order.subOrders.reduce((subTotal, subOrder) => {
        const deliveredProfit = subOrder.products.reduce((productTotal, product) => {
          return productTotal + Number(product.detailPrice) * Number(product.quantity);
        }, 0);
        return subTotal + deliveredProfit;
      }, 0);
      return total + subOrdersTotal;
    }, 0);

    const car = orders.reduce((total, order) => {
      const hasDeliveredStatus = order.subOrders.some((subOrder) =>
        subOrder.statusHistory.some((history) => ['7', '23'].includes(history.status)),
      );
      if (hasDeliveredStatus) {
        const subOrdersTotal = order.subOrders.reduce((subTotal, subOrder) => {
          const deliveredProfit = subOrder.products.reduce((productTotal, product) => {
            return productTotal + Number(product.detailPrice) * Number(product.quantity);
          }, 0);
          return subTotal + deliveredProfit;
        }, 0);
        return total + subOrdersTotal;
      }
      return total;
    }, 0);

    const returnedRevenue = orders.reduce((total, order) => {
      const subOrdersTotal = order.subOrders.reduce((subTotal, subOrder) => {
        const hasReturnedStatus = subOrder.statusHistory.some((history) => history.status === '25');
        if (hasReturnedStatus) {
          const productsTotal = subOrder.products.reduce((productTotal, product) => {
            return productTotal + Number(product.detailPrice) * Number(product.quantity);
          }, 0);
          return subTotal + productsTotal;
        }
        return subTotal;
      }, 0);
      return total + subOrdersTotal;
    }, 0);

    const cancelledRevenue = orders.reduce((total, order) => {
      const subOrdersTotal = order.subOrders.reduce((subTotal, subOrder) => {
        const hasReturnedStatus = subOrder.statusHistory.some((history) => history.status === 'EC01');
        if (hasReturnedStatus) {
          const productsTotal = subOrder.products.reduce((productTotal, product) => {
            return productTotal + Number(product.detailPrice) * Number(product.quantity);
          }, 0);
          return subTotal + productsTotal;
        }
        return subTotal;
      }, 0);
      return total + subOrdersTotal;
    }, 0);

    const paidOrdersProfit = orders.reduce((total, order) => {
      return (
        total +
        order.subOrders.reduce((subTotal, subOrder) => {
          const hasPaidStatus = ['23', 'EC02'].every((status) =>
            subOrder.statusHistory.some((history) => history.status === status),
          );
          return hasPaidStatus ? subTotal + (subOrder.sellerProfit || 0) : subTotal;
        }, 0)
      );
    }, 0);

    const paidSubOrders = subOrders.filter((subOrder) =>
      ['23', 'EC02'].every((status) => subOrder.statusHistory.some((history) => history.status === status)),
    ).length;

    // p

    const completedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => ['7', '23'].includes(history.status)),
    ).length;

    const returnedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === '25'),
    ).length;

    const totalSellerProfit = orders.reduce((total, order) => {
      return (
        total +
        order.subOrders.reduce((subTotal, subOrder) => {
          const hasDeliveredOrReturnedStatus = subOrder.statusHistory.some((history) =>
            ['25', '23', '7'].includes(history.status),
          );
          return hasDeliveredOrReturnedStatus ? subTotal + (subOrder.sellerProfit || 0) : subTotal;
        }, 0)
      );
    }, 0);

    const cancelledSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === 'EC01'),
    ).length;

    const pendingSubOrders = subOrders.filter(
      (subOrder) =>
        !subOrder.statusHistory.some((history) =>
          ['7', '25', 'EC01', '16', '21', '22', '23', '26', '28', '27', '28', 'EC02', 'EC03'].includes(history.status),
        ),
    ).length;

    const deliveredNotPaidProfit = subOrders.reduce((total, subOrder) => {
      const hasDeliveredStatus = subOrder.status && ['23', '7'].includes(subOrder.status);
      return hasDeliveredStatus ? total + (subOrder.sellerProfit || 0) : total;
    }, 0);

    let loss = subOrders
      .filter((subOrder) => subOrder.statusHistory.some((history) => ['EC01', '25'].includes(history.status)))
      .reduce((total, subOrder) => {
        return (
          total +
          subOrder.products.reduce((productTotal, product) => {
            return (
              productTotal +
              (Number(product.detailPrice) - Number(product.wholesalePrice || 0) * Number(product.quantity))
            );
          }, 0)
        );
      }, 0);

    loss = loss - loss * 0.1;

    return {
      success: 'stats-fetch-success',
      data: {
        cap: cap.toFixed(2),
        car: car.toFixed(2),
        returnedRevenue: returnedRevenue.toFixed(2),
        cancelledRevenue: cancelledRevenue.toFixed(2),
        subOrders: subOrders.length,
        transactions,
        products,
        pickups,
        sellersProfit: totalSellerProfit.toFixed(2),
        completedSubOrders,
        pendingSubOrders,
        cancelledSubOrders,
        returnedSubOrders,
        paidSubOrders,
        paidOrdersProfit: paidOrdersProfit.toFixed(2),
        deliveredNotPaidProfit: deliveredNotPaidProfit.toFixed(2),
        loss: loss.toFixed(2),
        monthlyProfitAndSubOrders: monthlyData,
        dailyProfitAndSubOrders: dailyData,
        topFiftyProducts,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'stats-fetch-error' };
  }
};

export const supplierGetStats = async (dateRange: DateRange): Promise<ActionResponse> => {
  const from = new Date(dateRange.from!.getTime() + 60 * 60 * 1000);
  const to = dateRange.to || endOfDay(from);

  try {
    await roleGuard(UserRole.SUPPLIER);

    const user = await currentUser();
    const [counts, monthlyData, dailyData, topFiftyProducts, subOrders, orders] = await Promise.all([
      fetchBasicSupplierCounts(user?.id!, from, to),
      calculateSupplierMonthlyProfitAndSubOrders(user?.id!),
      calculateSupplierDailyProfitAndSubOrders(user?.id!, startOfDay(subDays(new Date(), 10)), endOfDay(new Date())),
      fetchSuppliertopFiftyProducts(user?.id!, from, to),
      db.subOrder.findMany({
        where: {
          order: {
            subOrders: {
              some: {
                products: {
                  some: {
                    product: {
                      supplierId: user?.id!,
                    },
                  },
                },
              },
            },
            createdAt: { gte: from, lte: to },
          },
        },
        include: {
          statusHistory: true,
          products: {
            include: {
              product: true,
            },
          },
        },
      }),
      db.order.findMany({
        where: {
          subOrders: {
            some: {
              products: {
                some: {
                  product: {
                    supplierId: user?.id!,
                  },
                },
              },
            },
          },
          createdAt: { gte: from, lte: to },
        },
        include: {
          subOrders: {
            include: {
              statusHistory: true,
              products: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const [transactions, products, pickups] = counts;

    const cap = orders.reduce((total, order) => {
      const subOrdersTotal = order.subOrders.reduce((subTotal, subOrder) => {
        const productTotal = subOrder.products.reduce((productTotal, product) => {
          return (
            productTotal + Number(product.wholesalePrice ?? product.product?.wholesalePrice) * Number(product.quantity)
          );
        }, 0);
        return subTotal + productTotal;
      }, 0);
      return total + subOrdersTotal;
    }, 0);

    const cancelledSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === 'EC01'),
    ).length;

    const car = orders.reduce((total, order) => {
      const hasDeliveredStatus = order.subOrders.some((subOrder) =>
        subOrder.statusHistory.some((history) => ['7', '23'].includes(history.status)),
      );
      if (hasDeliveredStatus) {
        const subOrdersTotal = order.subOrders.reduce((subTotal, subOrder) => {
          const deliveredProfit = subOrder.products.reduce((productTotal, product) => {
            return (
              productTotal +
              Number(product.wholesalePrice ?? product.product?.wholesalePrice) * Number(product.quantity)
            );
          }, 0);
          return subTotal + deliveredProfit;
        }, 0);
        return total + subOrdersTotal;
      }
      return total;
    }, 0);

    const paidOrdersProfit = orders.reduce((total, order) => {
      return (
        total +
        order.subOrders.reduce((subTotal, subOrder) => {
          const hasPaidStatus = ['23', 'EC02'].every((status) =>
            subOrder.statusHistory.some((history) => history.status === status),
          );
          return hasPaidStatus ? subTotal + (subOrder.sellerProfit || 0) : subTotal;
        }, 0)
      );
    }, 0);

    const deliveredNotPaidProfit = subOrders.reduce((total, subOrder) => {
      const hasDeliveredStatus = subOrder.status && ['23', '7'].includes(subOrder.status);
      return hasDeliveredStatus ? total + (subOrder.sellerProfit || 0) : total;
    }, 0);

    const completedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => ['7', '23'].includes(history.status)),
    ).length;

    const paidSubOrders = subOrders.filter((subOrder) =>
      ['23', 'EC02'].every((status) => subOrder.statusHistory.some((history) => history.status === status)),
    ).length;

    const returnedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === '25'),
    ).length;

    const totalSupplierProfit = orders.reduce((total, order) => {
      return (
        total +
        order.subOrders.reduce((subTotal, subOrder) => {
          return (
            subTotal +
            subOrder.products.reduce((productTotal, product) => productTotal + (product.supplierProfit || 0), 0)
          );
        }, 0)
      );
    }, 0);

    const pendingSubOrders = subOrders.filter(
      (subOrder) =>
        !subOrder.statusHistory.some((history) =>
          ['7', '25', 'EC01', '16', '21', '22', '23', '26', '28', '27', '28', 'EC02', 'EC03'].includes(history.status),
        ),
    ).length;

    const pendingRevenue = subOrders
      .filter(
        (subOrder) =>
          !subOrder.statusHistory.some((history) =>
            ['7', '25', 'EC01', '16', '21', '22', '23', '26', '28', '27', '28', 'EC02', 'EC03'].includes(
              history.status,
            ),
          ),
      )
      .reduce(
        (total, subOrder) =>
          total +
          subOrder.products.reduce(
            (productTotal, product) =>
              productTotal +
              (product.wholesalePrice ?? product.product?.wholesalePrice ?? 0) * Number(product.quantity),
            0,
          ),
        0,
      );

    return {
      success: 'stats-fetch-success',
      data: {
        cap: cap.toFixed(2),
        car: car.toFixed(2),
        pendingRevenue: pendingRevenue.toFixed(2),
        subOrders: subOrders.length,
        products,
        pickups,
        supplierProfit: totalSupplierProfit.toFixed(2),
        completedSubOrders,
        pendingSubOrders,
        cancelledSubOrders,
        returnedSubOrders,
        paidSubOrders,
        paidOrdersProfit: paidOrdersProfit.toFixed(2),
        deliveredNotPaidProfit: deliveredNotPaidProfit.toFixed(2),
        monthlyProfitAndSubOrders: monthlyData,
        dailyProfitAndSubOrders: dailyData,
        topFiftyProducts: topFiftyProducts,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'stats-fetch-error' };
  }
};
