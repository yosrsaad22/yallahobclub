import { db } from '@/lib/db';

export const userGetOrderById = async (id: string) => {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        subOrders: {
          include: {
            pickup: true,
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
    return order;
  } catch {
    return null;
  }
};

export const admingGetOrderById = async (id: string) => {
  try {
    const order = await db.order.findUnique({
      where: { id },
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
    });
    return order;
  } catch {
    return null;
  }
};
