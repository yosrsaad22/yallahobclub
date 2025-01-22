'use server';
import { db } from '@/lib/db';
import { roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { z } from 'zod';
import { NotificationType, UserRole } from '@prisma/client';
import { TransactionSchema, WithdrawRequestSchema } from '@/schemas';

import { generateCode } from '@/lib/utils';
import { getTransactionById } from '@/data/transaction';
import { notifyAllAdmins, notifyUser } from './notifications';
import { getUserById } from '@/data/user';
import { revalidatePath } from 'next/cache';

export const getTransactions = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const transactions = await db.transaction.findMany({
      include: {
        order: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const updatedTransactions = transactions.map((t) => ({
      ...t,
      order: {
        ...t.order,
        code: t.order?.code ? t.order.code : 'N/A',
      },
    }));
    return { success: 'transactions-fetch-success', data: updatedTransactions };
  } catch (error) {
    return { error: 'transactions-fetch-error' };
  }
};

export const getTransaction = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPPLIER]);

    const transaction = await getTransactionById(id);
    return { success: 'transaction-fetch-success', data: transaction };
  } catch (error) {
    return { error: 'transaction-fetch-error' };
  }
};

export const getTransactionsByUser = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPPLIER]);

    const transactions = await db.transaction.findMany({
      where: {
        userId: id,
      },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });

    const updatedTransactions = transactions.map((t) => ({
      ...t,
      orderCode: t.order?.code ? t.order.code : 'N/A',
    }));

    return { success: 'transaction-fetch-success', data: updatedTransactions };
  } catch (error) {
    return { error: 'transaction-fetch-error' };
  }
};

//unused
export const addTransaction = async (values: z.infer<typeof TransactionSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const user = await getUserById(values.userId);

    const transaction = await db.transaction.create({
      data: {
        code: 'ENT-' + generateCode(),
        amount: parseFloat(values.amount),
        user: {
          connect: {
            id: values.userId,
          },
        },
      },
    });

    notifyUser(values.userId, NotificationType.NEW_TRANSACTION, `/dashboard/${user?.role.toLowerCase()}/transactions`);

    revalidatePath('/dashboard/admin/transactions');
    revalidatePath(`/dashboard/${user?.role.toLowerCase()}/transactions`);

    return { success: 'transaction-save-success', data: transaction };
  } catch (error) {
    return { error: 'transaction-save-error' };
  }
};

export const createTransaction = async (
  userId: string,
  type: string,
  amount: number,
  orderId?: string,
): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const user = await getUserById(userId);
    if (!user || user.balance === undefined || user.balance === null) {
      return { error: 'user-not-found-or-invalid-balance' };
    }

    const transaction = await db.$transaction(async (prisma) => {
      const createdTransaction = await prisma.transaction.create({
        data: {
          code: 'ENT-' + generateCode(),
          amount: amount,
          type: type,
          ...(orderId && {
            order: { connect: { id: orderId } },
          }),
          user: { connect: { id: userId } },
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      return createdTransaction;
    });

    await notifyUser(
      userId,
      NotificationType.NEW_TRANSACTION,
      `/dashboard/${user.role.toLowerCase()}/transactions`,
    ).catch((err) => console.error('Notification Error:', err));

    revalidatePath('/dashboard/admin/transactions');

    revalidatePath(`/dashboard/${user.role.toLowerCase()}/transactions`);

    return { success: 'transaction-save-success', data: transaction };
  } catch (error) {
    return { error: 'transaction-save-error' };
  }
};

export const getWithdrawRequests = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const requests = await db.withdrawRequest.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'withdraw-requests-fetch-success', data: requests };
  } catch (error) {
    return { error: 'withdraw-requests-fetch-error' };
  }
};

export const getWidthdrawRequestByUser = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.SUPPLIER]);

    const requests = await db.withdrawRequest.findMany({
      where: {
        userId: id,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'withdraw-request-fetch-success', data: requests };
  } catch (error) {
    return { error: 'withdraw-request-fetch-error' };
  }
};

export const createWithdrawRequest = async (values: z.infer<typeof WithdrawRequestSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.SUPPLIER]);

    const user = await getUserById(values.userId);
    const request = await db.withdrawRequest.create({
      data: {
        amount: parseFloat(values.amount),
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    notifyAllAdmins(NotificationType.NEW_WITHDRAW_REQUEST, '/dashboard/admin/transactions', user?.fullName);
    revalidatePath('/dashboard/admin/transactions');
    revalidatePath(`/dashboard/${user?.role.toLowerCase()}/transactions`);

    return { success: 'withdraw-request-save-success', data: request };
  } catch (error) {
    return { error: 'withdraw-request-save-error' };
  }
};

export const approveWithdrawRequest = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const fetchedRequest = await db.withdrawRequest.findUnique({ where: { id }, include: { user: true } });
    const request = await db.withdrawRequest.update({
      where: { id },
      data: { status: 'approved' },
    });
    await createTransaction(fetchedRequest?.userId!, 'withdraw-request', -fetchedRequest?.amount!);
    notifyUser(
      request.userId,
      NotificationType.WITHDRAW_REQUEST_APPROVED,
      `/dashboard/${fetchedRequest?.user.role.toLowerCase()}/transactions`,
    );
    revalidatePath('/dashboard/admin/transactions');
    revalidatePath(`/dashboard/${fetchedRequest?.user.role.toLowerCase()}/transactions`);

    return { success: 'withdraw-request-approved-success', data: request };
  } catch (error) {
    return { error: 'withdraw-request-approved-error' };
  }
};

export const declineWithdrawRequest = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const fetchedRequest = await db.withdrawRequest.findUnique({ where: { id }, include: { user: true } });
    const request = await db.withdrawRequest.update({
      where: { id },
      data: { status: 'declined' },
    });

    notifyUser(
      request.userId,
      NotificationType.WITHDRAW_REQUEST_DENIED,
      `/dashboard/${fetchedRequest?.user.role.toLowerCase()}/transactions`,
    );
    revalidatePath('/dashboard/admin/transactions');
    revalidatePath(`/dashboard/${fetchedRequest?.user.role.toLowerCase()}/transactions`);

    return { success: 'withdraw-request-declined-success', data: request };
  } catch (error) {
    return { error: 'withdraw-request-declined-error' };
  }
};
