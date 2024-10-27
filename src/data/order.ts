import { db } from '@/lib/db';

export const userGetOrderById = async (id: string) => {
  try {
    const order = await db.order.findUnique({
      where: { id },
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
      },
    });
    return order;
  } catch {
    return null;
  }
};
