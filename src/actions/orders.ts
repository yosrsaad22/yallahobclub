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
import { colorOptions, orderStatuses, roleOptions, sizeOptions } from '@/lib/constants';
import { notifyAllAdmins, notifyUser } from './notifications';
import { admingGetOrderById, userGetOrderById } from '@/data/order';
import { generateCode } from '@/lib/utils';
import { printLabelRequest, trackShipmentsRequest } from '@/lib/aramex';
import { createTransaction } from './transactions';

export const sellerGetOrders = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER);
  const user = await currentUser();
  try {
    const orders = await db.order.findMany({
      where: { sellerId: user?.id },
      orderBy: { createdAt: 'desc' },
      include: {
        subOrders: {
          include: {
            products: { include: { product: true } },
            statusHistory: true,
          },
        },
      },
    });
    await trackOrders(orders);
    const ordersWithStatuses = orders.map((order) => ({
      ...order,
      statuses: order.subOrders.map((subOrder) => subOrder.status),
    }));
    return { success: 'orders-fetch-success', data: ordersWithStatuses };
  } catch (error) {
    return { error: 'orders-fetch-error' };
  }
};

export const supplierGetOrders = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.SUPPLIER);
  const user = await currentUser();
  try {
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
            products: { include: { product: true } },
            statusHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    await trackOrders(orders);
    const ordersWithStatuses = orders.map((order) => ({
      ...order,
      subOrders: order.subOrders.filter((subOrder) =>
        subOrder.products.some((item) => item.product?.supplierId === user?.id),
      ),
      statuses: order.subOrders
        .filter((subOrder) => subOrder.products[0].product?.supplierId === user?.id)
        .map((subOrder) => subOrder.status),
    }));
    return { success: 'orders-fetch-success', data: ordersWithStatuses };
  } catch (error) {
    return { error: 'orders-fetch-error' };
  }
};

export const adminGetOrders = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN);
  try {
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
    const ordersWithStatuses = orders.map((order) => ({
      ...order,
      statuses: order.subOrders.map((subOrder) => subOrder.status),
    }));
    await trackOrders(ordersWithStatuses);
    return { success: 'orders-fetch-success', data: ordersWithStatuses };
  } catch (error) {
    return { error: 'orders-fetch-error' };
  }
};

export const getOrderById = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER || UserRole.ADMIN || UserRole.SUPPLIER);
  const role = await currentRole();
  try {
    let order;
    if (role === roleOptions.ADMIN) {
      order = await admingGetOrderById(id);
    } else {
      order = await userGetOrderById(id);
    }
    await trackOrder(order);
    return { success: 'order-fetch-success', data: order };
  } catch (error) {
    return { error: 'order-fetch-error' };
  }
};

export const cancelOrder = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER || UserRole.ADMIN);
  try {
    const order = await userGetOrderById(id);

    if (!order) {
      return { error: 'order-not-found-error' };
    }

    // Check if all subOrders have status 'awaiting-packaging-EC00'
    const allSubOrdersAwaiting = order.subOrders.every((subOrder) => subOrder.status === 'awaiting-packaging-EC00');

    if (!allSubOrdersAwaiting) {
      return { error: 'oorder-cancel-error' };
    }

    // Proceed to cancel each subOrder
    for (const subOrder of order.subOrders) {
      // Update subOrder status to 'seller-cancelled-EC01'
      await db.subOrder.update({
        where: { id: subOrder.id },
        data: {
          status: 'seller-cancelled-EC01',
          statusHistory: {
            create: {
              status: 'seller-cancelled-EC01',
              statusDescription: 'seller-cancelled-description-EC01',
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
  // Ensure the user has the correct role
  roleGuard(UserRole.ADMIN || UserRole.SELLER);
  const user = await currentUser();

  try {
    // Fetch the seller details
    const seller = await getUserById(values.sellerId);
    if (!seller) return { error: 'user-not-found-error' };

    // Generate a unique code for the main order
    const orderCode = `ENO-${generateCode()}`;

    // Start a database transaction for atomicity
    const order = await db.$transaction(async (tx: any) => {
      // Step 1: Group products by their supplierId
      const productIds = values.products.map((item) => item.productId);
      const productsList = await tx.product.findMany({
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
      productsList.forEach((product: any) => {
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

      // Step 2: Create the main Order without SubOrders
      const order = await tx.order.create({
        data: {
          code: orderCode,
          total: values.total,
          firstName: values.firstName,
          lastName: values.lastName,
          fullName: `${values.firstName} ${values.lastName}`,
          email: values.email,
          number: values.number,
          city: values.city,
          address: values.address,
          seller: {
            connect: { id: values.sellerId },
          },
          subOrders: {}, // Initialize empty, will be populated below
        },
      });

      // Step 3: Create SubOrders for each supplier group
      for (const [supplierId, products] of Object.entries(supplierGroups)) {
        // Fetch supplier details
        const supplier = await tx.user.findUnique({
          where: { id: supplierId },
          select: { id: true, fullName: true, address: true, city: true, number: true, code: true },
        });
        if (!supplier) {
          throw new Error(`Supplier with ID ${supplierId} not found`);
        }

        // Generate a unique code for the SubOrder
        const subOrderCode = `ENSO-${generateCode()}`;

        // Step 3a: Create the SubOrder
        const subOrder = await tx.subOrder.create({
          data: {
            code: subOrderCode,
            status: 'awaiting-packaging-EC00',
            deliveryId: null, // To be updated when pickup is created
            order: { connect: { id: order.id } },
            statusHistory: {
              create: {
                status: 'awaiting-packaging-EC00',
                statusDescription: 'awaiting-packaging-description-EC00',
                createdAt: new Date(),
              },
            },
          },
        });

        let subOrderPlatformProfit = 0;
        let subOrderSellerProfit = 0;
        let subOrderTotal = 0;

        // Calculate the delivery fee based on the number of unique suppliers
        let deliveryFee = Object.keys(supplierGroups).length > 1 ? 7 : 8;

        for (const item of products) {
          // **Seller's profit** (90% of the profit from selling the product)
          let sellerProfit =
            (parseFloat(item.detailPrice) -
              (productsList.find((product: any) => product.id === item.productId)?.wholesalePrice ?? 0)) *
            parseInt(item.quantity, 10) *
            0.9;
          subOrderSellerProfit += sellerProfit;
          subOrderTotal += parseFloat(item.detailPrice) * parseInt(item.quantity, 10);
          // **Platform Profit** (from seller's profit and supplier profit)
          const platformProfitFromSeller =
            (parseFloat(item.detailPrice) -
              (productsList.find((product: any) => product.id === item.productId)?.wholesalePrice ?? 0)) *
            parseInt(item.quantity, 10) *
            0.1;
          const platformProfitFromSupplier =
            parseInt(item.quantity) *
            productsList.find((product: any) => product.id === item.productId)?.platformProfit; // from supplier
          subOrderPlatformProfit +=
            platformProfitFromSeller + platformProfitFromSupplier + (Object.keys(supplierGroups).length > 1 ? 0 : 1);

          await tx.orderProduct.create({
            data: {
              code: `ENOP-${generateCode()}`,
              quantity: item.quantity,
              detailPrice: parseFloat(item.detailPrice),
              size: item.size as SizeType,
              color: item.color as ColorType,
              supplierProfit: item.supplierProfit,
              product: { connect: { id: item.productId } },
              subOrder: { connect: { id: subOrder.id } },
            },
          });

          // Step 4: Update Product Stock
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            include: { sellers: true },
          });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          // Decrement stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: product.stock - parseInt(item.quantity, 10) },
          });

          // Step 6: Notify Other Sellers about Stock Changes (if applicable)
          if (product.sellers && product.sellers.length > 0) {
            product.sellers.forEach((seller: any) => {
              if (seller.id !== user?.id) {
                notifyUser(
                  seller.id,
                  NotificationType.SELLER_STOCK_CHANGED,
                  `/dashboard/marketplace/all-products/${product.id}`,
                  product.name,
                );
              }
            });
          }

          // Step 7: Revalidate Product Paths
          revalidatePath(`/dashboard/marketplace/all-products/${product.id}`);
        }

        // Add the Delivery Fee to the platform profit

        // Update the subOrder with calculated profits
        await tx.subOrder.update({
          where: { id: subOrder.id },
          data: {
            platformProfit: subOrderPlatformProfit,
            sellerProfit: subOrderSellerProfit,
            total: subOrderTotal + deliveryFee,
          },
        });

        // Step 5: Send Notifications to Suppliers
        notifyUser(
          supplier.id,
          NotificationType.SUPPLIER_NEW_ORDER,
          `/dashboard/supplier/orders/${order.id}`,
          order.code,
        );
      }

      // Step 6: Send Notifications for Other Relevant Users (like seller)
      if (user?.role !== UserRole.ADMIN) {
        notifyAllAdmins(NotificationType.ADMIN_NEW_ORDER, `/dashboard/admin/orders/${order.id}`, seller.fullName);
      }

      // Step 7: Revalidate Relevant Paths
      revalidatePath(`/dashboard/marketplace`);
      revalidatePath(`/dashboard/marketplace/all-products`);
      revalidatePath('/dashboard/admin/orders');
      revalidatePath('/dashboard/supplier/orders');
      revalidatePath('/dashboard/seller/orders');

      return order; // Return the created order for further use
    });

    return { success: 'order-save-success' };
  } catch (error) {
    console.log(error);
    return { error: 'order-save-error' };
  }
};

export const trackOrders = async (orders: any[]): Promise<void> => {
  const url = process.env.ARAMEX_TRACKING_URL;
  if (!url) {
    throw new Error('ARAMEX_TRACKING_URL is not defined');
  }

  // Define statuses to exclude
  const excludedStatuses = [
    'delivered-SH005',
    'collected-SH006',
    'postal-delivery-SH007',
    'seller-cancelled-EC01',
    'returned-to-shipper-SH407',
    'finished-EC02',
    '',
  ];

  // Flatten orders to get active sub-orders
  const activeSubOrders = orders.flatMap((order) =>
    order.subOrders.filter((subOrder: SubOrder) => !excludedStatuses.includes(subOrder.status!)),
  );

  const deliveryIds: string[] = activeSubOrders.map((subOrder) => subOrder.deliveryId!);

  // Early return if no active sub-orders
  if (deliveryIds.length === 0) {
    return;
  }

  // Fetch tracking information
  const response = await fetch(`${url}/TrackShipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(trackShipmentsRequest({ deliveryIds })),
  });

  // Handle fetch errors
  if (!response.ok) {
    throw new Error(`Failed to track orders: ${response.statusText}`);
  }

  // Process response data
  const { TrackingResults = [] } = await response.json();

  for (const result of TrackingResults) {
    const subOrder = activeSubOrders.find((o) => o.deliveryId === result.Key);
    if (!subOrder) continue;

    const latestStatusUpdate = result.Value[result.Value.length - 1];
    const oldStatus = orderStatuses.find((status) => status.Key === subOrder.status);
    const newStatus = orderStatuses.find((status) => status.UpdateCode === latestStatusUpdate.UpdateCode);

    // Update sub-order status if it has changed
    if (newStatus && oldStatus && newStatus.Key !== oldStatus.Key) {
      const statusHistoryEntry = {
        status: newStatus.Key,
        statusDescription: newStatus.Description,
        createdAt: new Date(),
      };

      await db.subOrder.update({
        where: { id: subOrder.id },
        data: {
          status: newStatus.Key,
          statusHistory: {
            create: statusHistoryEntry,
          },
        },
      });

      // Notify the seller of the status change
      const order = orders.find((o) => o.subOrders.some((so: SubOrder) => so.id === subOrder.id));
      if (!order) continue;

      notifyUser(
        order.sellerId!,
        NotificationType.ORDER_STATUS_CHANGED,
        `/dashboard/seller/orders/${order.id}`,
        `#${order.code}`,
      );

      // Notify unique suppliers associated with the order
      const uniqueSuppliers = new Set(
        subOrder.products.map((item: OrderProduct & { product: Product }) => item.product?.supplierId),
      );
      for (const supplierId of uniqueSuppliers) {
        notifyUser(
          supplierId as string,
          NotificationType.ORDER_STATUS_CHANGED,
          `/dashboard/supplier/orders/${order.id}`,
          `#${order.code}`,
        );
      }

      // Notify all admins
      notifyAllAdmins(NotificationType.ORDER_STATUS_CHANGED, `/dashboard/admin/orders/${order.id}`, `#${order.code}`);
    }
  }
};

export const trackOrder = async (subOrder: any): Promise<void> => {
  const url = process.env.ARAMEX_TRACKING_URL;
  if (!url) {
    throw new Error('ARAMEX_TRACKING_URL is not defined');
  }

  // Define statuses to exclude
  const excludedStatuses = ['delivered-SH005', 'seller-cancelled-EC01', 'finished-EC02', 'returned-to-shipper-SH407'];

  // Check if the order status is excluded
  if (excludedStatuses.includes(subOrder.status)) {
    return; // No tracking needed for excluded statuses
  }

  // Fetch tracking information
  const response = await fetch(`${url}/TrackShipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(trackShipmentsRequest({ deliveryIds: [subOrder.deliveryId] })),
  });

  // Handle fetch errors
  if (!response.ok) {
    throw new Error(`Failed to track order: ${response.statusText}`);
  }

  // Process response data
  const { TrackingResults = [] } = await response.json();
  const result = TrackingResults[0];
  if (!result) {
    return; // No tracking result available
  }

  const latestStatusUpdate = result.Value[result.Value.length - 1];
  const oldStatus = orderStatuses.find((status) => status.Key === subOrder.status);
  const newStatus = orderStatuses.find((status) => status.UpdateCode === latestStatusUpdate.UpdateCode);

  // Update order status if it has changed
  if (newStatus && oldStatus && newStatus.Key !== oldStatus.Key) {
    const statusHistoryEntry = {
      status: newStatus.Key,
      statusDescription: newStatus.Description,
      createdAt: new Date(),
    };

    await db.subOrder.update({
      where: { id: subOrder.id },
      data: {
        status: newStatus.Key,
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

    // Notify all admins
    notifyAllAdmins(NotificationType.ORDER_STATUS_CHANGED, `/dashboard/admin/orders/${order!.id}`, `#${order!.code}`);
  }
};

export const printLabel = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SUPPLIER || UserRole.ADMIN);
  try {
    const subOrder = await db.subOrder.findUnique({ where: { id } });
    if (subOrder?.status === 'seller-cancelled-EC01') {
      return { error: 'print-label-order-cancelled-error' };
    }
    if (subOrder?.deliveryId === undefined || !subOrder?.deliveryId) {
      return { error: 'print-label-order-no-pickup-error' };
    }

    const url = process.env.ARAMEX_SHIPPING_URL;
    if (!url) {
      throw new Error('URL is not defined');
    }

    const response = await fetch(url + '/PrintLabel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(printLabelRequest({ deliveryId: subOrder?.deliveryId })),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error('Failed to send pickup request to Aramex');
    }
    return { success: 'print-label-success', data: responseData.ShipmentLabel.LabelURL };
  } catch (error) {
    return { error: 'print-label-error' };
  }
};

export const markOrdersAsPaid = async (ids: string[]): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN);
  try {
    const orders = await db.order.findMany({
      where: { id: { in: ids } },
      include: { subOrders: true },
    });

    if (!orders) {
      return { error: 'order-not-found-error' };
    } // Define statuses to exclude
    const excludedStatuses = [
      'delivered-SH005',
      'collected-SH006',
      'postal-delivery-SH007',
      'seller-cancelled-EC01',
      'returned-to-shipper-SH407',
      'finished-EC02',
      '',
    ];

    for (const order of orders) {
      for (const subOrder of order.subOrders) {
        await db.subOrder.update({
          where: { id: subOrder.id },
          data: {
            status: 'finished-EC02',
            statusHistory: {
              create: {
                status: 'finished-EC02',
                statusDescription: 'finished-description-EC02',
                createdAt: new Date(),
              },
            },
          },
        });
        /* if(subOrder.status === 'returned-to-shipper-SH407') {
    await createTransaction(order.sellerId!,'order-transaction' , -2);
   }
   else {
    await createTransaction(order.sellerId!,'order-transaction', subOrder.);
   }*/
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
