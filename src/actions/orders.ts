'use server';
import { db } from '@/lib/db';
import { currentRole, currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  NotificationType,
  UserRole,
  OrderProduct,
  Order,
  SizeType,
  ColorType,
  SubOrder,
  Product,
} from '@prisma/client';
import { getUserById } from '@/data/user';
import { OrderSchema } from '@/schemas';
import { roleOptions } from '@/lib/constants';
import { notifyAllAdmins, notifyUser } from './notifications';
import { admingGetOrderById, userGetOrderById } from '@/data/order';
import { generateCode } from '@/lib/utils';
import { createTransaction } from './transactions';
import { getTranslations } from 'next-intl/server';

export const sellerGetOrders = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.SELLER);
    const user = await currentUser();

    const orders = await db.order.findMany({
      where: { sellerId: user?.id },
      orderBy: { createdAt: 'desc' },
      include: {
        subOrders: {
          include: {
            products: {
              include: {
                product: {
                  include: {
                    media: true,
                  },
                },
              },
            },
            statusHistory: true,
          },
        },
      },
    });
    const modifiedOrders = orders.map((order) => ({
      ...order,
      fullName: `${order.firstName} ${order.lastName}`,
      statuses: order.subOrders.map((subOrder) => subOrder.status),
      products: order.subOrders.flatMap((subOrder) => subOrder.products).map((product) => product.product!.id),
      displayProducts: order.subOrders.flatMap((subOrder) => subOrder.products).flatMap((product) => product.product),
    }));
    return { success: 'orders-fetch-success', data: modifiedOrders };
  } catch (error) {
    return { error: 'orders-fetch-error' };
  }
};

export const supplierGetOrders = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.SUPPLIER);
    const user = await currentUser();
    const orders = await db.order.findMany({
      where: {
        subOrders: {
          some: {
            products: {
              some: {
                product: {
                  supplierId: user?.id,
                },
              },
            },
          },
        },
      },
      include: {
        subOrders: {
          include: {
            products: {
              include: {
                product: {
                  include: {
                    media: true,
                  },
                },
              },
            },
            statusHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const modifiedOrders = orders.map((order) => ({
      ...order,
      fullName: `${order.firstName} ${order.lastName}`,
      subOrders: order.subOrders.filter((subOrder) =>
        subOrder.products.some((item) => item.product?.supplierId === user?.id),
      ),
      statuses: order.subOrders
        .filter((subOrder) => subOrder.products[0].product?.supplierId === user?.id)
        .map((subOrder) => subOrder.status),
      products: order.subOrders.flatMap((subOrder) => subOrder.products).map((product) => product.product!.id),
      displayProducts: order.subOrders.flatMap((subOrder) => subOrder.products).flatMap((product) => product.product),
    }));
    return { success: 'orders-fetch-success', data: modifiedOrders };
  } catch (error) {
    return { error: 'orders-fetch-error' };
  }
};

export const adminGetOrders = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const orders = await db.order.findMany({
      include: {
        seller: true,
        subOrders: {
          include: {
            pickup: true,
            products: {
              include: {
                product: {
                  include: {
                    media: true,
                    supplier: true,
                  },
                },
              },
            },
            statusHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const modifiedOrders = orders.map((order) => ({
      ...order,
      fullName: `${order.firstName} ${order.lastName}`,
      suppliers: order.subOrders.map((subOrder) => subOrder.products[0]?.product?.supplier?.id),
      statuses: order.subOrders.map((subOrder) => subOrder.status),
      displayProducts: order.subOrders.flatMap((subOrder) => subOrder.products).flatMap((product) => product.product),
      products: order.subOrders
        .flatMap((subOrder) => subOrder.products)
        .filter((product) => product.product)
        .map((product) => product.product!.id),
    }));

    return { success: 'orders-fetch-success', data: modifiedOrders };
  } catch (error) {
    return { error: 'orders-fetch-error' };
  }
};

export const getOrderById = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPPLIER]);
    const role = await currentRole();
    let order;
    if (role === roleOptions.ADMIN) {
      order = await admingGetOrderById(id);
    } else {
      order = await userGetOrderById(id);
    }
    await trackOrder(order);
    return { success: 'order-fetch-success', data: order };
  } catch (error) {
    console.log(error);
    return { error: 'order-fetch-error' };
  }
};

export const cancelOrder = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.ADMIN]);
    const role = await currentRole();

    const order = await userGetOrderById(id);

    if (!order) {
      return { error: 'order-not-found-error' };
    }

    // Check if all subOrders have status 'awaiting-packaging-EC00'
    const allSubOrdersAwaiting = order.subOrders.every((subOrder) => subOrder.status === 'EC00');

    if (role === roleOptions.SELLER && !allSubOrdersAwaiting) {
      return { error: 'order-cancel-error' };
    }

    // Proceed to cancel each subOrder
    for (const subOrder of order.subOrders) {
      // Update subOrder status to 'seller-cancelled-EC01'
      await db.subOrder.update({
        where: { id: subOrder.id },
        data: {
          status: 'EC01',
          statusHistory: {
            create: {
              status: 'EC01',
              createdAt: new Date(),
            },
          },
        },
      });

      // Restore stock for each product in the subOrder
      for (const orderProduct of subOrder.products) {
        if (orderProduct.productId) {
          const product = await db.product.findUnique({
            where: { id: orderProduct.productId },
          });

          if (product) {
            await db.product.update({
              where: { id: orderProduct.productId },
              data: { stock: product.stock + parseInt(orderProduct.quantity) },
            });
          }
        }
      }

      // Notify the supplier about the cancellation of the subOrder
      const notifiedSuppliers = new Set<string>();
      for (const orderProduct of subOrder.products) {
        if (orderProduct.product?.supplierId && !notifiedSuppliers.has(orderProduct.product.supplierId)) {
          notifyUser(
            orderProduct.product.supplierId,
            NotificationType.ORDER_CANCELLED,
            `/dashboard/supplier/orders/${order.id}`,
            `#${order.code || 'N/A'}`,
          );
          notifiedSuppliers.add(orderProduct.product.supplierId);
        }
      }
    }

    // Notify all admins about the order cancellation
    notifyAllAdmins(NotificationType.ORDER_CANCELLED, `/dashboard/admin/orders/${order.id}`, `#${order.code || 'N/A'}`);

    // Revalidate relevant paths
    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/supplier/orders');
    revalidatePath('/dashboard/seller/orders');
    revalidatePath(`/dashboard/seller/orders/${order.id}`);

    return { success: 'order-cancel-success' };
  } catch (error) {
    console.error(error);
    return { error: 'order-cancel-error' };
  }
};

export const addOrder = async (values: z.infer<typeof OrderSchema>): Promise<ActionResponse> => {
  try {
    // Ensure the user has the correct role
    await roleGuard([UserRole.ADMIN, UserRole.SELLER]);
    const user = await currentUser();

    // Fetch the seller details
    const seller = await getUserById(values.sellerId);
    if (!seller) return { error: 'user-not-found-error' };

    // Generate a unique code for the main order
    const orderCode = `ENO-${generateCode()}`;

    // Step 1: Group products by their supplierId
    const productIds = values.products.map((item) => item.productId);
    const productsList = await db.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        supplierId: true,
        name: true,
        stock: true,
        wholesalePrice: true,
        platformProfit: true,
        sellers: true,
      },
    });

    const productSupplierMap: Record<string, string> = {};
    productsList.forEach((product) => {
      if (product.supplierId) {
        productSupplierMap[product.id] = product.supplierId;
      } else {
        throw new Error(`Product with ID ${product.id} does not have a supplierId`);
      }
    });

    // Group OrderProducts by supplierId
    const supplierGroups: Record<string, typeof values.products> = {};
    values.products.forEach((item) => {
      const supplierId = productSupplierMap[item.productId];
      if (!supplierId) {
        throw new Error(`Supplier not found for product ID ${item.productId}`);
      }
      if (!supplierGroups[supplierId]) {
        supplierGroups[supplierId] = [];
      }
      supplierGroups[supplierId].push(item);
    });

    // Step 2: Create the main Order
    const order = await db.order.create({
      data: {
        code: orderCode,
        total: values.total,
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        number: values.number,
        comment: values.comment,
        openable: values.openable,
        fragile: values.fragile,
        city: values.city,
        state: values.state,
        address: values.address,
        seller: {
          connect: { id: values.sellerId },
        },
      },
    });

    // Step 3: Create SubOrders for each supplier group
    for (const [supplierId, products] of Object.entries(supplierGroups)) {
      const supplier = await db.user.findUnique({
        where: { id: supplierId },
        select: { id: true, fullName: true, address: true, city: true, state: true, number: true, code: true },
      });
      if (!supplier) {
        throw new Error(`Supplier with ID ${supplierId} not found`);
      }

      // Generate a unique code for the SubOrder
      const subOrderCode = `ENSO-${generateCode()}`;

      const subOrder = await db.subOrder.create({
        data: {
          code: subOrderCode,
          status: 'EC00',
          deliveryId: null,
          order: { connect: { id: order.id } },
          statusHistory: {
            create: {
              status: 'EC00',
              createdAt: new Date(),
            },
          },
        },
      });

      let subOrderPlatformProfit = 0;
      let subOrderSellerProfit = 0;
      let subOrderTotal = 0;

      let deliveryFee = Object.keys(supplierGroups).length > 1 ? 7 : 8;

      for (const item of products) {
        // Removed 1 DT from the seller profit
        let sellerProfit =
          (parseFloat(item.detailPrice) -
            (productsList.find((product) => product.id === item.productId)?.wholesalePrice ?? 0)) *
            parseInt(item.quantity, 10) *
            0.9 -
          1;
        subOrderSellerProfit += sellerProfit;
        subOrderTotal += parseFloat(item.detailPrice) * parseInt(item.quantity, 10);

        const platformProfitFromSeller =
          (parseFloat(item.detailPrice) -
            (productsList.find((product) => product.id === item.productId)?.wholesalePrice ?? 0)) *
          parseInt(item.quantity, 10) *
          0.1;

        const platformProfitFromSupplier =
          parseInt(item.quantity) *
          (productsList.find((product) => product.id === item.productId)?.platformProfit || 0);

        // Added packaging fees for 1 DT
        subOrderPlatformProfit += platformProfitFromSeller + platformProfitFromSupplier + 1;

        await db.orderProduct.create({
          data: {
            code: `ENOP-${generateCode()}`,
            quantity: item.quantity,
            detailPrice: parseFloat(item.detailPrice),
            size: item.size as SizeType,
            color: item.color as ColorType,
            platformProfit: productsList.find((product) => product.id === item.productId)?.platformProfit,
            wholesalePrice: productsList.find((product) => product.id === item.productId)?.wholesalePrice,
            supplierProfit: item.supplierProfit,
            product: { connect: { id: item.productId } },
            subOrder: { connect: { id: subOrder.id } },
          },
        });

        const product = await db.product.findUnique({
          where: { id: item.productId },
          include: { sellers: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        await db.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - parseInt(item.quantity, 10) },
        });

        if (product.sellers && product.sellers.length > 0) {
          for (const seller of product.sellers) {
            if (seller.id !== user?.id) {
              notifyUser(
                seller.id,
                NotificationType.SELLER_STOCK_CHANGED,
                `/dashboard/marketplace/all-products/${product.id}`,
                product.name,
              );
            }
          }
        }

        revalidatePath(`/dashboard/marketplace/all-products/${product.id}`);
      }

      await db.subOrder.update({
        where: { id: subOrder.id },
        data: {
          platformProfit: subOrderPlatformProfit,
          sellerProfit: subOrderSellerProfit,
          total: subOrderTotal + deliveryFee,
        },
      });

      notifyUser(
        supplier.id,
        NotificationType.SUPPLIER_NEW_ORDER,
        `/dashboard/supplier/orders/${order.id}`,
        order.code,
      );
    }

    notifyAllAdmins(NotificationType.ADMIN_NEW_ORDER, `/dashboard/admin/orders/${order.id}`, seller.fullName);
    revalidatePath(`/dashboard/marketplace`);
    revalidatePath(`/dashboard/marketplace/all-products`);
    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/supplier/orders');
    revalidatePath('/dashboard/seller/orders');

    return { success: 'order-save-success' };
  } catch (error) {
    console.error('Add order error :', error);
    return { error: 'order-save-error' };
  }
};

export const trackOrders = async (): Promise<ActionResponse> => {
  const url = process.env.MASSAR_URL;
  if (!url) {
    throw new Error('MASSAR_URL is not defined');
  }

  try {
    const excludedStatuses = ['21', '22', '23', 'EC01', 'EC02', 'EC03', ''];

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchDeliveryStatus = async (deliveryId: string) => {
      try {
        const response = await fetch(`${url}/tracking/${deliveryId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch status for deliveryId ${deliveryId}: ${response.statusText}`);
          return null;
        }

        const data = await response.json();
        return data?.colis?.etat || null;
      } catch (error) {
        console.error(`Error fetching status for deliveryId ${deliveryId}:`, error);
        return null;
      }
    };

    const allOrders = await db.order.findMany({
      include: {
        seller: true,
        subOrders: {
          include: {
            pickup: true,
            products: {
              include: {
                product: {
                  include: {
                    supplier: true,
                  },
                },
              },
            },
            statusHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (allOrders.length === 0) {
      console.log('No orders to process');
      return { success: 'No orders to track' };
    }

    const activeSubOrders = allOrders
      .flatMap((order) => order.subOrders)
      .filter((subOrder) => subOrder.deliveryId && !excludedStatuses.includes(subOrder.status!));

    if (activeSubOrders.length === 0) {
      console.log('No active sub-orders to track');
      return { success: 'No active sub-orders to track' };
    }

    for (const subOrder of activeSubOrders) {
      const deliveryId = subOrder.deliveryId!;
      const newStatus = await fetchDeliveryStatus(deliveryId);

      if (!newStatus || newStatus === subOrder.status) continue;

      try {
        const statusHistoryEntry = {
          status: newStatus,
          createdAt: new Date(),
        };

        await db.subOrder.update({
          where: { id: subOrder.id },
          data: {
            status: newStatus,
            statusHistory: { create: statusHistoryEntry },
          },
        });

        const order = allOrders.find((o) => o.subOrders.some((so) => so.id === subOrder.id));
        if (order) {
          notifyUser(
            order.sellerId!,
            NotificationType.ORDER_STATUS_CHANGED,
            `/dashboard/seller/orders/${order.id}`,
            `#${order.code}`,
          );

          const uniqueSuppliers = new Set(subOrder.products.map((item) => item.product?.supplierId));
          for (const supplierId of uniqueSuppliers) {
            notifyUser(
              supplierId!,
              NotificationType.ORDER_STATUS_CHANGED,
              `/dashboard/supplier/orders/${order.id}`,
              `#${order.code}`,
            );
          }
        }
      } catch (error) {
        console.error(`Error updating status for subOrder ID ${subOrder.id}:`, error);
      }

      await delay(100);
    }

    console.log('All orders tracked successfully');
    return { success: 'orders-track-success' };
  } catch (error) {
    console.error('Error in trackOrders:', error);
    return { error: 'orders-track-error' };
  }
};

export const trackOrder = async (subOrder: any): Promise<void> => {
  const url = process.env.MASSAR_URL;
  if (!url) {
    throw new Error('URL is not defined');
  }

  // Define statuses to exclude
  const excludedStatuses = ['21', '22', '23', 'EC01', 'EC02', 'EC03', ''];

  // Check if the order status is excluded
  if (!subOrder.deliveryId || excludedStatuses.includes(subOrder.status)) {
    return; // No tracking needed for excluded statuses
  }

  // Fetch tracking information for a single order
  const response = await fetch(`${url}/tracking/${subOrder.deliveryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Handle fetch errors
  if (!response.ok) {
    throw new Error(`Failed to track order: ${response.statusText}`);
  }

  // Process response data
  const data = await response.json();

  // Get the latest status update (first element of the `etats` array)
  const oldStatus = subOrder.status;
  const newStatus = data.colis.etat;

  // Update sub-order status if it has changed
  if (newStatus && oldStatus && newStatus !== oldStatus) {
    const statusHistoryEntry = {
      status: newStatus,
      createdAt: new Date(),
    };

    await db.subOrder.update({
      where: { id: subOrder.id },
      data: {
        status: newStatus,
        statusHistory: {
          create: statusHistoryEntry,
        },
      },
    });

    const order = await userGetOrderById(subOrder.orderId);
    // Notify the seller of the status change
    notifyUser(
      subOrder.sellerId,
      NotificationType.ORDER_STATUS_CHANGED,
      `/dashboard/seller/orders/${order!.id}`,
      `#${order!.code}`,
    );

    // Notify unique suppliers associated with the order
    const uniqueSuppliers = new Set(subOrder.products.map((item: any) => item.product?.supplierId));
    for (const supplierId of uniqueSuppliers) {
      notifyUser(
        supplierId as string,
        NotificationType.ORDER_STATUS_CHANGED,
        `/dashboard/supplier/orders/${order!.id}`,
        `#${order!.code}`,
      );
    }
  }
};

export const printLabel = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SUPPLIER, UserRole.ADMIN]);

    const subOrder = await db.subOrder.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              include: {
                supplier: true,
              },
            },
          },
        },
        order: {
          include: {
            subOrders: true,
            seller: true,
          },
        },
      },
    });
    if (subOrder?.status === 'EC01') {
      return { error: 'print-label-order-cancelled-error' };
    }
    if (subOrder?.deliveryId === undefined || !subOrder?.deliveryId) {
      return { error: 'print-label-order-no-pickup-error' };
    }

    const url = process.env.PDF_API_URL + '/pdf/generateLabel';

    const modifiedSubOrder = {
      ...subOrder,
      comment: subOrder.order?.comment,
      openable: subOrder.order?.openable,
      fragile: subOrder.order?.fragile,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PDF_API_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ subOrder: modifiedSubOrder }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate label');
    }
    const res = await response.json();
    return { success: 'print-label-success', data: process.env.PDF_API_URL + res.data };
  } catch (error) {
    console.log(error);
    return { error: 'print-label-error' };
  }
};

export const printLabels = async (ids: string[]): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SUPPLIER, UserRole.ADMIN]);

    const subOrders = await db.subOrder.findMany({
      where: { orderId: { in: ids } },
      include: {
        products: {
          include: {
            product: {
              include: {
                supplier: true,
              },
            },
          },
        },
        order: {
          include: {
            subOrders: true,
            seller: true,
          },
        },
      },
    });
    for (const sub of subOrders) {
      if (sub.status === 'EC01') {
        return { error: 'print-labels-order-cancelled-error' };
      }
      if (sub.deliveryId === undefined || !sub.deliveryId) {
        return { error: 'print-labels-order-no-pickup-error' };
      }
    }

    const url = process.env.PDF_API_URL + '/pdf/generateLabels';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PDF_API_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ subOrders: subOrders }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate labels');
    }
    const res = await response.json();
    return { success: 'print-labels-success', data: process.env.PDF_API_URL + res.data };
  } catch (error) {
    console.log(error);
    return { error: 'print-labels-error' };
  }
};

export const markOrdersAsPaid = async (ids: string[]): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);
    const orders = await db.order.findMany({
      where: { id: { in: ids } },
      include: {
        subOrders: {
          include: {
            statusHistory: true,
            products: {
              include: {
                product: {
                  include: {
                    supplier: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orders) {
      return { error: 'order-not-found-error' };
    } // Define statuses to exclude

    const excludedStatuses = ['21', '22', '23', '25', '26', '27', '28'];
    for (const order of orders) {
      for (const subOrder of order.subOrders) {
        if (!excludedStatuses.includes(subOrder.status!)) {
          return { error: 'order-paid-invalid-error' };
        }
      }
    }
    for (const order of orders) {
      // Livraison
      for (const subOrder of order.subOrders) {
        if (
          subOrder.status === '22' ||
          subOrder.status === '25' ||
          subOrder.status === '26' ||
          subOrder.status === '27' ||
          subOrder.status === '28'
        ) {
          await createTransaction(order.sellerId!, 'order-transaction', -3, order.id);
          await db.subOrder.update({
            where: { id: subOrder.id },
            data: {
              status: 'EC03',
              platformProfit: 2.5,
              sellerProfit: -3,
              products: {
                updateMany: {
                  where: { subOrderId: subOrder.id },
                  data: { supplierProfit: 0 },
                },
              },
              statusHistory: {
                create: {
                  status: 'EC03',
                  createdAt: new Date(),
                },
              },
            },
          });
          const subOrderProducts = await db.orderProduct.findMany({
            where: { subOrderId: subOrder.id },
            include: { product: true },
          });

          for (const orderProduct of subOrderProducts) {
            if (orderProduct.productId) {
              const product = await db.product.findUnique({
                where: { id: orderProduct.productId },
              });

              if (product) {
                await db.product.update({
                  where: { id: orderProduct.productId },
                  data: { stock: product.stock + parseInt(orderProduct.quantity) },
                });
              }
            }
          }
        } else if (subOrder.status === '23') {
          await db.subOrder.update({
            where: { id: subOrder.id },
            data: {
              status: 'EC02',
              statusHistory: {
                create: {
                  status: 'EC02',
                  createdAt: new Date(),
                },
              },
            },
          });
          await createTransaction(order.sellerId!, 'order-transaction', subOrder.sellerProfit!, order.id);
          subOrder.products.forEach(async (op) => {
            if (op.product?.supplierId) {
              await createTransaction(op.product.supplierId, 'order-transaction', op.supplierProfit!, order.id);
            }
          });
        }
      }

      revalidatePath(`/dashboard/seller/orders/${order.id}`);
    }

    // Revalidate relevant paths
    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/supplier/orders');
    revalidatePath('/dashboard/seller/orders');

    return { success: 'order-paid-success' };
  } catch (error) {
    console.error(error);
    return { error: 'order-paid-error' };
  }
};

export const exportOrders = async (ids?: string[]): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const orders = await db.order.findMany({
      where: {
        ...(ids && ids.length > 0 ? { id: { in: ids } } : {}),
      },
      include: {
        seller: true,
        subOrders: {
          include: {
            statusHistory: true,
            products: {
              include: {
                product: {
                  include: {
                    supplier: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const tStatuses = await getTranslations('dashboard.order-statuses');

    const formattedOrders = orders.flatMap((order) => {
      return order.subOrders.map((subOrder) => {
        const products = subOrder.products.map((p) => `${p.quantity} x ${p.product?.name}`).join(' + ');
        const supplierProfit = subOrder.products.reduce((total, p) => total + p.supplierProfit, 0);

        return {
          orderCode: order.code,
          subOrderCode: subOrder.code,
          products,
          sellerName: order.seller?.fullName || '',
          sellerProfit: subOrder.sellerProfit || 0,
          platformProfit: subOrder.platformProfit || 0,
          supplierProfit,
          total: subOrder.total || 0,
          createdAt: order.createdAt.toISOString(),
          status: tStatuses(subOrder.status),
        };
      });
    });
    return { success: 'export-success', data: formattedOrders };
  } catch (error) {
    return { error: 'export-error' };
  }
};
