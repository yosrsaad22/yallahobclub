import { db } from '@/lib/db';

export const supplierGetPickupById = async (id: string) => {
  try {
    const pickup = await db.pickup.findUnique({
      where: { id },
      include: {
        subOrders: {
          include: {
            order: true,
            products: true,
          },
        },
      },
    });
    return pickup;
  } catch {
    return null;
  }
};

export const admingGetPickupById = async (id: string) => {
  try {
    const pickup = await db.pickup.findUnique({
      where: { id },
      include: {
        subOrders: {
          include: {
            order: { include: { seller: true } },
            products: { include: { product: { include: { supplier: true } } } },
          },
        },
      },
    });
    return pickup;
  } catch {
    return null;
  }
};
