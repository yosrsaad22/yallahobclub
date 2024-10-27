'use server';
import { db } from '@/lib/db';
import { currentRole, currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { NotificationType, UserRole } from '@prisma/client';
import { getUserById } from '@/data/user';
import { OrderSchema } from '@/schemas';
import { colorOptions, roleOptions, sizeOptions } from '@/lib/constants';
import { notifyAllAdmins, notifyUser } from './notifications';
import { admingGetOrderById, userGetOrderById } from '@/data/order';

export const sellerGetOrders = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER);
  const user = await currentUser();
  try {
    const orders = await db.order.findMany({
      where: {
        sellerId: user?.id,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'orders-fetch-success', data: orders };
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
        products: {
          some: {
            product: {
              supplierId: user?.id,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'orders-fetch-success', data: orders };
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
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'orders-fetch-success', data: orders };
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
    return { success: 'order-fetch-success', data: order };
  } catch (error) {
    return { error: 'order-fetch-error' };
  }
};

export const cancelOrder = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER || UserRole.ADMIN);
  try {
    const order = await userGetOrderById(id);
    if (order?.status === 'record-created') {
      await db.order.update({ where: { id }, data: { status: 'seller-cancelled' } });
      order.products.forEach((op) => {
        db.product.update({
          where: { id: op.productId! },
          data: { stock: op.product?.stock! + parseInt(op.quantity) },
        });
      });

      notifyAllAdmins(NotificationType.ORDER_CANCELLED, `/dashboard/admin/orders/${order.id}`, '#' + order.deliveryId);
      order.products.forEach(async (item) => {
        notifyUser(
          item.product?.supplierId!,
          NotificationType.ORDER_CANCELLED,
          `/dashboard/supplier/orders/${order.id}`,
          '#' + order.deliveryId,
        );
      });
      revalidatePath('/dashboard/admin/orders');
      revalidatePath('/dashboard/supplier/orders');
      revalidatePath('/dashboard/seller/orders');
      return { success: 'order-cancel-success' };
    } else {
      return { error: 'order-cancel-error' };
    }
  } catch (error) {
    return { error: 'order-cancel-error' };
  }
};

export const addOrder = async (values: z.infer<typeof OrderSchema>): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SELLER);
  const user = await currentUser();
  try {
    console.log(values.products);
    const seller = await getUserById(values.sellerId);

    if (!seller) return { error: 'user-not-found-error' };

    const order = await db.order.create({
      data: {
        total: values.total,
        sellerProfit: values.sellerProfit,
        platformProfit: values.platformProfit,
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: values.firstName + ' ' + values.lastName,
        email: values.email,
        number: values.number,
        city: values.city,
        address: values.address,
        products: {
          create: values.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            detailPrice: parseFloat(item.detailPrice),
            size: item.size as sizeOptions,
            color: item.color as colorOptions,
            supplierProfit: item.supplierProfit,
          })),
        },
        seller: {
          connect: {
            id: values.sellerId,
          },
        },
      },
      include: {
        seller: true,
        products: {
          include: {
            product: {
              include: {
                sellers: true,
              },
            },
          },
        },
      },
    });

    order.products.forEach(async (item) => {
      if (item.product) {
        await db.product.update({
          where: { id: item.productId! },
          data: { stock: item.product.stock - parseInt(item.quantity) },
        });
        notifyUser(
          item.product.supplierId!,
          NotificationType.SUPPLIER_NEW_ORDER,
          `/dashboard/supplier/orders/${order.id}`,
          item.product.name,
        );
        notifyAllAdmins(
          NotificationType.ADMIN_NEW_ORDER,
          `/dashboard/admin/orders/${order.id}`,
          order.seller?.fullName!,
        );
        if (item.product.sellers && item.product.sellers.length > 0) {
          item.product.sellers.forEach(async (seller) => {
            if (item.product && seller.id !== user?.id) {
              notifyUser(
                seller.id,
                NotificationType.SELLER_STOCK_CHANGED,
                `/dashboard/marketplace/all-products/${item.product.id}`,
                item.product.name,
              );
            }
          });
        }
        revalidatePath(`/dashboard/marketplace/all-products/${item.product.id}`);
      }
    });
    revalidatePath(`/dashboard/marketplace`);
    revalidatePath(`/dashboard/marketplace/all-products`);
    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/supplier/orders');
    revalidatePath('/dashboard/seller/orders');
    return { success: 'order-save-success' };
  } catch (error) {
    return { error: 'order-save-error' };
  }
};

export const requestPickup = async (ids: string[]): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    const orders = await db.order.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    for (const order of orders) {
      if (order.status !== 'record-created' && order.status === 'seller-cancelled') {
        return { error: 'pickup-request-order-cancelled-error' };
      } else if (order.status !== 'record-created' && order.status !== 'seller-cancelled') {
        return { error: 'pickup-request-order-ongoing-error' };
      } else {
        await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: 'packaged-ready',
          },
        });
        notifyUser(
          order.sellerId!,
          NotificationType.ORDER_STATUS_CHANGED,
          `/dashboard/seller/orders/${order.id}`,
          '#' + order.deliveryId,
        );
        notifyAllAdmins(
          NotificationType.ORDER_STATUS_CHANGED,
          `/dashboard/admin/orders/${order.id}`,
          '#' + order.deliveryId,
        );

        revalidatePath('/dashboard/admin/orders');
        revalidatePath('/dashboard/seller/orders');
        revalidatePath('/dashboard/supplier/orders');
      }
    }
    return { success: 'pickup-request-success' };
  } catch (error) {
    return { error: 'pickup-request-error' };
  }
};

export const printLabel = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SUPPLIER || UserRole.ADMIN);
  try {
    const order = await userGetOrderById(id);
    if (order?.status === 'seller-cancelled') {
      return { error: 'print-label-order-cancelled-error' };
    }
    return { success: 'print-label-success' };
  } catch (error) {
    return { error: 'print-label-error' };
  }
};
