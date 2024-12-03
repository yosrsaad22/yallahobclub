'use server';
import { db } from '@/lib/db';
import { currentRole, currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { NotificationType, UserRole } from '@prisma/client';
import { postalCodes, roleOptions, states } from '@/lib/constants';
import { notifyAllAdmins, notifyUser } from './notifications';
import { formatDate, generateCode } from '@/lib/utils';
import { admingGetPickupById, supplierGetPickupById } from '@/data/pickup';
import { getTranslations } from 'next-intl/server';
import { createShipment } from '@/lib/massar';

export const supplierGetPickups = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.SUPPLIER);
    const user = await currentUser();

    const pickups = await db.pickup.findMany({
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
            order: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return { success: 'pickups-fetch-success', data: pickups };
  } catch (error) {
    return { error: 'pickups-fetch-error' };
  }
};

export const adminGetPickups = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const pickups = await db.pickup.findMany({
      include: {
        subOrders: {
          include: {
            order: {
              include: {
                seller: true,
              },
            },
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
      orderBy: { createdAt: 'desc' },
    });

    const pickupsWithSupplier = pickups.map((pickup) => ({
      ...pickup,
      supplier: pickup.subOrders[0].products[0].product?.supplier,
    }));

    return { success: 'pickups-fetch-success', data: pickupsWithSupplier };
  } catch (error) {
    return { error: 'pickups-fetch-error' };
  }
};

export const getPickupById = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SUPPLIER]);
    const role = await currentRole();

    let pickup;
    if (role === roleOptions.ADMIN) {
      pickup = await admingGetPickupById(id);
    } else {
      pickup = await supplierGetPickupById(id);
    }
    return { success: 'pickup-fetch-success', data: pickup };
  } catch (error) {
    return { error: 'pickup-fetch-error' };
  }
};

export const adminRequestPickup = async (orderIds: string[]): Promise<ActionResponse> => {
  const tColors = await getTranslations('dashboard.colors');

  try {
    await roleGuard(UserRole.ADMIN);

    // Fetch Orders and related SubOrders based on the provided order IDs
    const orders = await db.order.findMany({
      where: {
        id: {
          in: orderIds,
        },
      },
      include: {
        subOrders: {
          include: {
            order: {
              include: {
                subOrders: true,
              },
            },
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

    let supplierGroups: Record<string, any[]> = {};

    // Group subOrders by supplier
    for (const order of orders) {
      for (const subOrder of order.subOrders) {
        if (subOrder.status === 'EC01') {
          return { error: 'pickup-request-order-cancelled-error' };
        } else if (subOrder.status === 'EC00') {
          const supplierId = subOrder.products[0].product?.supplier?.id;
          if (!supplierId) continue;

          if (!supplierGroups[supplierId]) {
            supplierGroups[supplierId] = [];
          }

          supplierGroups[supplierId].push(subOrder);
        } else {
          return { error: 'pickup-request-invalid-error' };
        }
      }
    }
    // Process each supplier group in parallel
    const pickupPromises = Object.keys(supplierGroups).map(async (supplierId) => {
      const subOrdersForSupplier = supplierGroups[supplierId];
      subOrdersForSupplier.forEach(async (subOrder: any, index: number) => {
        let ref1;
        if (subOrder.order.subOrders.length > 1) {
          ref1 =
            'Sous commande : ' +
            subOrder.code +
            ' ' +
            index +
            '/' +
            subOrder.order.subOrders.length +
            ' de ' +
            subOrder.order.code;
        } else {
          ref1 = 'Commande ' + subOrder.order.code;
        }

        const shipment = createShipment({
          ref1: ref1,
          products: subOrder.products
            .map(
              (item: any) =>
                `${item.quantity}*${item.product?.name}, ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
            )
            .join(' + '),
          price: subOrder.total!,
          postalCode: postalCodes[states.findIndex((state) => state === subOrder.order?.state)!],
          city: subOrder.order?.city!,
          number: subOrder.order?.number!,
          address: subOrder.order?.address!,
          name: subOrder.order?.fullName!,
          pieces: subOrder.products.length.toString(),
          pickupId: parseInt(subOrder.products[0].product?.supplier?.pickupId!),
          openParcel: '0',
          fragile: '0',
          exchangeContent: '',
        });

        const url = process.env.MASSAR_URL;
        if (!url) {
          throw new Error('URL is not defined');
        }

        const response = await fetch(url + '/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(shipment),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error('Failed to send pickup request');
        }

        await db.subOrder.update({
          where: { id: subOrder.id },
          data: {
            deliveryId: responseData.code_barre,
            status: '1',
            statusHistory: {
              create: {
                status: '1',
                createdAt: new Date(),
              },
            },
          },
        });

        notifyUser(
          subOrder.order?.sellerId!,
          NotificationType.ORDER_STATUS_CHANGED,
          `/dashboard/seller/orders/${subOrder.id}`,
          `#${subOrder.code}`,
        );

        const now = new Date();
        let pickupDate = new Date(now);

        if (now.getHours() < 12) {
          pickupDate.setHours(13, 0, 0, 0);
        } else {
          pickupDate.setDate(now.getDate() + 1);
          pickupDate.setHours(13, 0, 0, 0);
        }
        const pickup = await db.pickup.create({
          data: {
            pickupDate: pickupDate,
            code: 'ENPU-' + generateCode(),
            subOrders: {
              connect: subOrdersForSupplier.map((subOrder) => ({ id: subOrder.id })),
            },
          },
        });
        notifyAllAdmins(NotificationType.NEW_PICKUP, `/dashboard/admin/pickups`, `${formatDate(pickup.pickupDate!)}`);
      });
    });

    // Await all pickup requests and updates to complete
    await Promise.all(pickupPromises);
    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/seller/orders');
    revalidatePath('/dashboard/supplier/orders');
    return { success: 'pickup-request-success' };
  } catch (error) {
    return { error: 'pickup-request-error' };
  }
};

export const requestPickup = async (orderIds: string[]): Promise<ActionResponse> => {
  const tColors = await getTranslations('dashboard.colors');
  try {
    await roleGuard(UserRole.SUPPLIER);
    const user = await currentUser();
    // Fetch subOrders where the supplier matches the current user
    const subOrders = await db.subOrder.findMany({
      where: {
        orderId: {
          in: orderIds,
        },
        products: {
          some: {
            product: {
              supplierId: user?.id,
            },
          },
        },
      },
      include: {
        order: {
          include: {
            subOrders: true,
            seller: true,
          },
        },
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
    });

    // Process each subOrder for the current supplier
    for (const subOrder of subOrders) {
      if (subOrder.status === 'EC01') {
        return { error: 'pickup-request-order-cancelled-error' };
      } else if (subOrder.status === 'EC00') {
        let ref1;
        if (subOrder!.order!.subOrders.length > 1) {
          ref1 =
            'Sous commande ' +
            subOrder.code +
            ' ' +
            (subOrder!.order!.subOrders.findIndex((element: any) => element.deliveryId === subOrder.deliveryId) + 1) +
            '/' +
            subOrder!.order!.subOrders.length +
            ' de ' +
            subOrder!.order!.code;
        } else {
          ref1 = 'Commande' + subOrder!.order!.code;
        }
        const shipment = createShipment({
          ref1: ref1,
          products: subOrder.products
            .map(
              (item) =>
                `${item.quantity}*${item.product?.name}, ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
            )
            .join(' + '),
          price: subOrder.total!,
          postalCode: postalCodes[states.findIndex((state) => state === subOrder.order?.state)!],
          city: subOrder.order?.city!,
          number: subOrder.order?.number!,
          address: subOrder.order?.address!,
          name: subOrder.order?.fullName!,
          pieces: subOrder.products.length.toString(),
          pickupId: parseInt(subOrder.products[0].product?.supplier?.pickupId!),
          openParcel: '0',
          fragile: '0',
          exchangeContent: '',
        });
        const url = process.env.MASSAR_URL;
        if (!url) {
          throw new Error('URL is not defined');
        }
        const response = await fetch(url + '/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(shipment),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error('Failed to send pickup request');
        }

        await db.subOrder.update({
          where: { id: subOrder.id },
          data: {
            deliveryId: responseData.code_barre,
            status: '1',
            statusHistory: {
              create: {
                status: '1',
                createdAt: new Date(),
              },
            },
          },
        });
        notifyUser(
          subOrder.order?.sellerId!,
          NotificationType.ORDER_STATUS_CHANGED,
          `/dashboard/seller/orders/${subOrder.id}`,
          `#${subOrder.code}`,
        );
      } else {
        return { error: 'pickup-request-invalid-error' };
      }
    }

    const now = new Date();
    let pickupDate = new Date(now);

    if (now.getHours() < 12) {
      pickupDate.setHours(13, 0, 0, 0);
    } else {
      pickupDate.setDate(now.getDate() + 1);
      pickupDate.setHours(13, 0, 0, 0);
    }

    const pickup = await db.pickup.create({
      data: {
        pickupDate: pickupDate,
        code: 'ENPU-' + generateCode(),
        subOrders: {
          connect: subOrders.map((so) => ({ id: so.id })),
        },
      },
    });

    notifyAllAdmins(NotificationType.NEW_PICKUP, `/dashboard/admin/pickups`, `${formatDate(pickup.pickupDate!)}`);

    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/seller/orders');
    revalidatePath('/dashboard/supplier/orders');
    return { success: 'pickup-request-success' };
  } catch (error) {
    return { error: 'pickup-request-error' };
  }
};

export const printPickup = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SUPPLIER]);

    const pickup = await db.pickup.findUnique({
      where: {
        id: id,
      },
      include: {
        subOrders: {
          include: {
            order: {
              include: {
                seller: true,
              },
            },
            products: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    const url = process.env.PDF_API_URL + '/pdf/generateDecharge';
    if (!url) {
      throw new Error('PDF_API_URL is not defined');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PDF_API_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        code: pickup!.code,
        subOrders: pickup!.subOrders,
        createdAt: pickup!.createdAt,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate decharge document');
    }

    const res = await response.json();
    console.log(process.env.PDF_API_URL + res.data);

    return { success: 'pickup-print-success', data: process.env.PDF_API_URL + res.data };
  } catch (error) {
    return { error: 'pickup-print-error' };
  }
};
