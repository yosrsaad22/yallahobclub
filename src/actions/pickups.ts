'use server';
import { db } from '@/lib/db';
import { currentRole, currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { NotificationType, UserRole, Pickup } from '@prisma/client';
import { colorOptions, orderStatuses, roleOptions, sizeOptions } from '@/lib/constants';
import { notifyAllAdmins, notifyUser } from './notifications';
import { formatDate, generateCode } from '@/lib/utils';
import { admingGetPickupById, supplierGetPickupById } from '@/data/pickup';
import { createPickupRequest, createShipment, ShipmentParams } from '@/lib/aramex';
import { getTranslations } from 'next-intl/server';
import { generateDechargeDoc } from './documents';
import { pick } from 'lodash';

export const supplierGetPickups = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.SUPPLIER);
  const user = await currentUser();
  try {
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
  roleGuard(UserRole.ADMIN);
  try {
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
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  const role = await currentRole();
  try {
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
  roleGuard(UserRole.ADMIN);
  const tColors = await getTranslations('dashboard.colors');

  try {
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
        if (subOrder.status === 'seller-cancelled-EC01') {
          return { error: 'pickup-request-order-cancelled-error' };
        } else if (subOrder.status === 'awaiting-packaging-EC00') {
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

      let shipments: any[] = [];

      subOrdersForSupplier.map((subOrder: any) => {
        let ref1;
        if (subOrder.order.subOrders.length > 1) {
          ref1 = 'Sous commande :' + subOrder.code + ' ' + subOrder.order.subOrders.indexOf(subOrder) + 1;
          +'/' + subOrder.order.subOrders.length + ' de ' + subOrder.order.code;
        } else {
          ref1 = 'Sous commande :' + subOrder.code + ' de ' + subOrder.order.code;
        }
        shipments.push(
          createShipment({
            ref1: ref1,
            ref2: subOrder.code,
            supplierCode: subOrder.products[0].product?.supplier?.code!,
            supplierAddress: subOrder.products[0].product?.supplier?.address!,
            supplierCity: subOrder.products[0].product?.supplier?.city!,
            supplierFullname: subOrder.products[0].product?.supplier?.fullName!,
            supplierNumber: subOrder.products[0].product?.supplier?.number!,
            clientAddress: subOrder.order!.address!,
            clientCity: subOrder.order!.city!,
            clientFullName: subOrder.order!.fullName!,
            clientNumber: subOrder.order!.number!,
            orderTotal: subOrder.order!.total,
            descriptionOfGoods: subOrder.products
              .map(
                (item: any) =>
                  `${item.quantity}*${item.product?.name}, ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
              )
              .join(' + '),
            products: subOrder.products.map((item: any) => ({
              Quantity: parseInt(item.quantity),
              PackageType: 'Box',
              Reference:
                (item.product?.name || '') +
                ' ' +
                (item.size ? item.size : '') +
                ' ' +
                (item.color ? tColors(item.color) : ''),
              Comments: item.code,
              Weight: {
                Unit: 'KG',
                Value: 0.5,
              },
            })),
          }),
        );
      });

      // Create pickup request for each supplier
      const pickupRequest = createPickupRequest({
        supplierAddress: subOrdersForSupplier[0].products[0].product?.supplier?.address!,
        supplierCity: subOrdersForSupplier[0].products[0].product?.supplier?.city!,
        supplierFullName: subOrdersForSupplier[0].products[0].product?.supplier?.fullName!,
        supplierNumber: subOrdersForSupplier[0].products[0].product?.supplier?.number!,
        shipments: shipments,
        pickUpReference: 'Ref',
      });

      const url = process.env.ARAMEX_SHIPPING_URL;
      if (!url) {
        throw new Error('URL is not defined');
      }

      const response = await fetch(url + '/CreatePickup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(pickupRequest),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.HasErrors === true) {
        throw new Error('Failed to send pickup request to Aramex');
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
            connect: subOrdersForSupplier.map((subOrder) => ({ id: subOrder.id })),
          },
        },
      });

      notifyAllAdmins(NotificationType.NEW_PICKUP, `/dashboard/admin/pickups`, `${formatDate(pickup.pickupDate!)}`);

      // Process each shipment response and update the order status
      const processedShipments = responseData.ProcessedPickup?.ProcessedShipments || [];

      for (const shipment of processedShipments) {
        const matchedSubOrder = subOrdersForSupplier.find((subOrder) => subOrder.code === shipment.Reference2);

        if (matchedSubOrder) {
          const statusHistoryEntry = {
            status: 'record-created-SH203',
            statusDescription: 'record-created-description-SH203',
            createdAt: new Date(),
          };

          await db.subOrder.update({
            where: { id: matchedSubOrder.id },
            data: {
              deliveryId: shipment.ID,
              status: 'record-created-SH203',
              statusHistory: {
                create: statusHistoryEntry,
              },
            },
          });

          notifyUser(
            matchedSubOrder.order?.sellerId!,
            NotificationType.ORDER_STATUS_CHANGED,
            `/dashboard/seller/orders/${matchedSubOrder.order?.id}`,
            `#${shipment.ID}`,
          );
        }
      }
    });

    // Await all pickup requests and updates to complete
    await Promise.all(pickupPromises);

    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/seller/orders');
    revalidatePath('/dashboard/supplier/orders');
    return { success: 'pickup-request-success' };
  } catch (error) {
    console.error(error);
    return { error: 'pickup-request-error' };
  }
};

export const requestPickup = async (orderIds: string[]): Promise<ActionResponse> => {
  roleGuard(UserRole.SUPPLIER);
  const user = await currentUser();
  const tColors = await getTranslations('dashboard.colors');
  try {
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

    let shipments: any[] = [];

    // Process each subOrder for the current supplier
    for (const subOrder of subOrders) {
      if (subOrder.status === 'seller-cancelled-EC01') {
        return { error: 'pickup-request-order-cancelled-error' };
      } else if (subOrder.status === 'awaiting-packaging-EC00') {
        let ref1;
        if (subOrder!.order!.subOrders.length > 1) {
          ref1 = 'Sous commande :' + subOrder.code + ' ' + subOrder!.order!.subOrders.indexOf(subOrder) + 1;
          +'/' + subOrder!.order!.subOrders.length + ' de ' + subOrder!.order!.code;
        } else {
          ref1 = 'Sous commande :' + subOrder.code + ' de ' + subOrder!.order!.code;
        }
        shipments.push(
          createShipment({
            ref1: ref1,
            ref2: subOrder.code,
            supplierCode: subOrder.products[0].product?.supplier?.code!,
            supplierAddress: subOrder.products[0].product?.supplier?.address!,
            supplierCity: subOrder.products[0].product?.supplier?.city!,
            supplierFullname: subOrder.products[0].product?.supplier?.fullName!,
            supplierNumber: subOrder.products[0].product?.supplier?.number!,
            clientAddress: subOrder.order!.address!,
            clientCity: subOrder.order!.city!,
            clientFullName: subOrder.order!.fullName!,
            clientNumber: subOrder.order!.number!,
            orderTotal: subOrder.order!.total,
            descriptionOfGoods: subOrder.products
              .map(
                (item) =>
                  `${item.quantity}*${item.product?.name}, ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
              )
              .join(' + '),
            products: subOrder.products.map((item) => ({
              Quantity: parseInt(item.quantity),
              PackageType: 'Box',
              Reference:
                (item.product?.name || '') +
                ' ' +
                (item.size ? item.size : '') +
                ' ' +
                (item.color ? tColors(item.color) : ''),
              Comments: item.code,
              Weight: {
                Unit: 'KG',
                Value: 0.5,
              },
            })),
          }),
        );
      } else {
        return { error: 'pickup-request-invalid-error' };
      }
    }

    const pickupRequest = createPickupRequest({
      supplierAddress: subOrders[0].products[0].product?.supplier?.address!,
      supplierCity: subOrders[0].products[0].product?.supplier?.city!,
      supplierFullName: subOrders[0].products[0].product?.supplier?.fullName!,
      supplierNumber: subOrders[0].products[0].product?.supplier?.number!,
      shipments: shipments,
      pickUpReference: 'Ref',
    });

    const url = process.env.ARAMEX_SHIPPING_URL;
    if (!url) {
      throw new Error('URL is not defined');
    }

    const response = await fetch(url + '/CreatePickup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(pickupRequest),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error('Failed to send pickup request to Aramex');
    }

    // Processing the response to update each order
    const processedShipments = responseData.ProcessedPickup?.ProcessedShipments || [];

    for (const shipment of processedShipments) {
      const matchedSubOrder = subOrders.find((subOrder) => subOrder.code === shipment.Reference1);

      if (matchedSubOrder) {
        // Update the order with the new delivery ID from shipment.ID
        await db.subOrder.update({
          where: { id: matchedSubOrder.id },
          data: {
            deliveryId: shipment.ID,
            status: 'record-created-SH203',
            statusHistory: {
              create: {
                status: 'record-created-SH203',
                statusDescription: 'record-created-description-SH203',
                createdAt: new Date(),
              },
            },
          },
        });

        // Notify the user and admins of the status update
        notifyUser(
          matchedSubOrder.order?.sellerId!,
          NotificationType.ORDER_STATUS_CHANGED,
          `/dashboard/seller/orders/${matchedSubOrder.id}`,
          `#${matchedSubOrder.code}`,
        );
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
    console.error(error);
    return { error: 'pickup-request-error' };
  }
};

export const printPickup = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
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

    const res = await generateDechargeDoc(pickup!.code, pickup!.subOrders, pickup!.createdAt, pickup!.pickupDate!);
    return { success: 'pickup-print-success', data: res.data };
  } catch (error) {
    console.error(error);
    return { error: 'pickup-print-error' };
  }
};
