'use server';
import { db } from '@/lib/db';
import { currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse, DailyProfitAndSubOrders, MonthlyProfitAndSubOrders } from '@/types';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@prisma/client';
import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';

interface DateRange {
  from?: Date;
  to?: Date;
}

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

async function calculateMonthlyProfitAndSubOrders() {
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
            subOrders: {
              some: {
                status: 'EC02',
              },
            },
            createdAt: { gte: start, lte: end },
          },
          include: { subOrders: true },
        });

        const monthlyProfit = orders.reduce(
          (total, order) =>
            total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.platformProfit || 0), 0),
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
            subOrders: {
              some: {
                status: 'EC02',
              },
            },
            sellerId: id,
            createdAt: { gte: start, lte: end },
          },
          include: { subOrders: true },
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
            status: 'EC02',
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

async function calculateDailyProfitAndSubOrders(from: Date, to: Date) {
  const dailySubOrders = await db.subOrder.findMany({
    where: {
      status: 'EC02',
      order: { createdAt: { gte: from, lte: to } },
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
    dailyDataMap[dateStr].profit += subOrder.platformProfit || 0;
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

async function calculateSellerDailyProfitAndSubOrders(id: string, from: Date, to: Date) {
  const dailySubOrders = await db.subOrder.findMany({
    where: {
      status: 'EC02',

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
      status: 'EC02',
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

async function fetchTopFiveProducts(from: Date, to: Date) {
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
      .slice(0, 5)
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

async function fetchSellerTopFiveProducts(id: string, from: Date, to: Date) {
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
      .slice(0, 5) // Limit to top 5
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

async function fetchSupplierTopFiveProducts(id: string, from: Date, to: Date) {
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

  // Fetch product details for the top 5 products
  return Promise.all(
    Object.values(aggregated)
      .sort((a, b) => b.totalQuantity - a.totalQuantity) // Sort by quantity in descending order
      .slice(0, 5) // Limit to top 5
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

async function fetchTopFiveSellers(from: Date, to: Date) {
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
      .slice(0, 5)
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
  roleGuard(UserRole.ADMIN);
  const from = dateRange.from || new Date();
  const to = dateRange.to || new Date();

  try {
    const [counts, monthlyData, dailyData, topFiveProducts, topFiveSellers, subOrders, orders] = await Promise.all([
      fetchBasicCounts(from, to),
      calculateMonthlyProfitAndSubOrders(),
      calculateDailyProfitAndSubOrders(startOfDay(subDays(new Date(), 10)), endOfDay(new Date())),
      fetchTopFiveProducts(from, to),
      fetchTopFiveSellers(from, to),
      db.subOrder.findMany({
        where: {
          order: { createdAt: { gte: from, lte: to } },
        },
        include: { statusHistory: true },
      }),
      db.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        include: { subOrders: true },
      }),
    ]);

    const [leads, transactions, products, suppliers, sellers] = counts;

    const completedSubOrders = subOrders.filter((subOrder) => subOrder.status === '23').length;
    const paidSubOrders = subOrders.filter((subOrder) => subOrder.status === 'EC02').length;
    const returnedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === '28'),
    ).length;

    const totalPlatformProfit = orders.reduce((total, order) => {
      return total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.platformProfit || 0), 0);
    }, 0);

    const totalSellerProfit = orders.reduce((total, order) => {
      return total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.sellerProfit || 0), 0);
    }, 0);

    const pendingSubOrders = subOrders.length - (completedSubOrders + paidSubOrders + returnedSubOrders);

    return {
      success: 'stats-fetch-success',
      data: {
        leads,
        subOrders: subOrders.length,
        platformProfit: totalPlatformProfit.toFixed(1),
        transactions,
        sellersProfit: totalSellerProfit.toFixed(1),
        completedSubOrders,
        pendingSubOrders,
        returnedSubOrders,
        paidSubOrders,
        sellers,
        suppliers,
        products,
        monthlyProfitAndSubOrders: monthlyData,
        dailyProfitAndSubOrders: dailyData,
        topFiveProducts,
        topFiveSellers,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'stats-fetch-error' };
  }
};

export const sellerGetStats = async (dateRange: DateRange): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN);
  const from = dateRange.from || new Date();
  const to = dateRange.to || new Date();

  try {
    const user = await currentUser();
    const [counts, monthlyData, dailyData, topFiveProducts, subOrders, orders] = await Promise.all([
      fetchBasicSellerCounts(user?.id!, from, to),
      calculateSellerMonthlyProfitAndSubOrders(user?.id!),
      calculateSellerDailyProfitAndSubOrders(user?.id!, startOfDay(subDays(new Date(), 10)), endOfDay(new Date())),
      fetchSellerTopFiveProducts(user?.id!, from, to),
      db.subOrder.findMany({
        where: {
          order: {
            sellerId: user?.id!,
            createdAt: { gte: from, lte: to },
          },
        },
        include: { statusHistory: true },
      }),
      db.order.findMany({
        where: {
          sellerId: user?.id!,
          createdAt: { gte: from, lte: to },
        },
        include: { subOrders: true },
      }),
    ]);

    const [transactions, products, pickups] = counts;

    const completedSubOrders = subOrders.filter((subOrder) => subOrder.status === '23').length;
    const paidSubOrders = subOrders.filter((subOrder) => subOrder.status === 'EC02').length;
    const returnedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === '28'),
    ).length;

    const totalSellerProfit = orders.reduce((total, order) => {
      return total + order.subOrders.reduce((subTotal, subOrder) => subTotal + (subOrder.sellerProfit || 0), 0);
    }, 0);

    const pendingSubOrders = subOrders.length - (completedSubOrders + paidSubOrders + returnedSubOrders);
    return {
      success: 'stats-fetch-success',
      data: {
        subOrders: subOrders.length,
        transactions,
        products,
        pickups,
        sellersProfit: totalSellerProfit.toFixed(1),
        completedSubOrders,
        pendingSubOrders,
        returnedSubOrders,
        paidSubOrders,
        monthlyProfitAndSubOrders: monthlyData,
        dailyProfitAndSubOrders: dailyData,
        topFiveProducts,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'stats-fetch-error' };
  }
};

export const supplierGetStats = async (dateRange: DateRange): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN);
  const from = dateRange.from || new Date();
  const to = dateRange.to || new Date();

  try {
    const user = await currentUser();
    const [counts, monthlyData, dailyData, topFiveProducts, subOrders, orders] = await Promise.all([
      fetchBasicSupplierCounts(user?.id!, from, to),
      calculateSupplierMonthlyProfitAndSubOrders(user?.id!),
      calculateSupplierDailyProfitAndSubOrders(user?.id!, startOfDay(subDays(new Date(), 10)), endOfDay(new Date())),
      fetchSupplierTopFiveProducts(user?.id!, from, to),
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
        include: { statusHistory: true },
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
              products: true,
            },
          },
        },
      }),
    ]);

    const [transactions, products, pickups] = counts;

    const completedSubOrders = subOrders.filter((subOrder) => subOrder.status === '23').length;
    const paidSubOrders = subOrders.filter((subOrder) => subOrder.status === 'EC02').length;
    const returnedSubOrders = subOrders.filter((subOrder) =>
      subOrder.statusHistory.some((history) => history.status === '28'),
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

    const pendingSubOrders = subOrders.length - (completedSubOrders + paidSubOrders + returnedSubOrders);
    return {
      success: 'stats-fetch-success',
      data: {
        subOrders: subOrders.length,
        transactions,
        products,
        pickups,
        sellersProfit: totalSupplierProfit.toFixed(1),
        completedSubOrders,
        pendingSubOrders,
        returnedSubOrders,
        paidSubOrders,
        monthlyProfitAndSubOrders: monthlyData,
        dailyProfitAndSubOrders: dailyData,
        topFiveProducts,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: 'stats-fetch-error' };
  }
};
