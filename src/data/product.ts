import { db } from '@/lib/db';

export const getProductById = async (id: string) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { 
        media: true,
        sellers:true,
        supplier:true,

      },
    });
    return product;
  } catch {
    return null;
  }
};
