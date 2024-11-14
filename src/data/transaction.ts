import { db } from '@/lib/db';

export const getTransactionById = async (id: string) => {
  try {
    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });
    return transaction;
  } catch {
    return null;
  }
};
