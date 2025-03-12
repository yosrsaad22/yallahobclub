'use server';
import { db } from '@/lib/db';
import { currentUser, roleGuard } from '@/lib/auth';
import { NotificationType, UserPack, UserRole } from '@prisma/client';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { OnBoardingSchema, UserSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById, getUserByNumber } from '@/data/user';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { sendAccountActivationEmail, sendEmailVerificationEmail } from '@/lib/mail';
import { capitalizeWords, generateCode } from '@/lib/utils';
import { DEFAULT_PASSWORD, packOptions, roleOptions } from '@/lib/constants';
import { notifyAllAdmins, notifyUser } from './notifications';

export const getUsers = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const users = await db.user.findMany({
      where: {
        role: {
          not: UserRole.ADMIN,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'users-fetch-success', data: users };
  } catch (error) {
    return { error: 'users-fetch-error' };
  }
};

export const getSellers = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const sellers = await db.user.findMany({
      where: {
        role: UserRole.SELLER,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        soldOrders: {
          include: {
            subOrders: {
              include: {
                statusHistory: true,
              },
            },
          },
        },
      },
    });

    const sellersWithReturnRate = sellers.map((seller) => {
      const returnedSubOrders = seller.soldOrders.flatMap((order) =>
        order.subOrders.filter((subOrder) => subOrder.statusHistory.some((history) => history.status === '25')),
      ).length;

      const totalSubOrders = seller.soldOrders.flatMap((order) => order.subOrders).length;
      const returnRate = totalSubOrders > 0 ? (returnedSubOrders / totalSubOrders) * 100 : 0;
      return { ...seller, returnRate };
    });

    return { success: 'sellers-fetch-success', data: sellersWithReturnRate };
  } catch (error) {
    return { error: 'sellers-fetch-error' };
  }
};

export const getSuppliers = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const suppliers = await db.user.findMany({
      where: {
        role: UserRole.SUPPLIER,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        products: {
          include: {
            orders: {
              include: {
                subOrder: {
                  include: {
                    statusHistory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const suppliersWithReturnRate = suppliers.map((supplier) => {
      const returnedSubOrders = supplier.products.flatMap((product) =>
        product.orders.flatMap((orderProduct) =>
          orderProduct.subOrder?.statusHistory.some((history) => history.status === '25')
            ? [orderProduct.subOrder]
            : [],
        ),
      ).length;

      const totalSubOrders = supplier.products.flatMap((product) =>
        product.orders.flatMap((orderProduct) => (orderProduct.subOrder ? [orderProduct.subOrder] : [])),
      ).length;

      const returnRate = totalSubOrders > 0 ? (returnedSubOrders / totalSubOrders) * 100 : 0;

      return { ...supplier, returnRate };
    });

    return { success: 'suppliers-fetch-success', data: suppliersWithReturnRate };
  } catch (error) {
    return { error: 'suppliers-fetch-error' };
  }
};

export const getUser = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);

    const user = await getUserById(id);
    if (!user) return { error: 'user-not-found-error' };
    return { success: 'user-fetch-success', data: user };
  } catch (error) {
    return { error: 'user-fetch-error' };
  }
};

export const addUser = async (values: z.infer<typeof UserSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const existingNumber = await getUserByNumber(values.number);
    const existingEmail = await getUserByEmail(values.email);

    if (existingNumber || existingEmail) {
      return { error: 'existing-user-error' };
    }

    let emailVerified;

    if (values.emailVerified === true) {
      emailVerified = new Date();
    } else {
      emailVerified = null;
      const verificationToken = await generateEmailVerificationToken(values.email.trim());
      await sendEmailVerificationEmail(values.fullName.trim(), verificationToken.email, verificationToken.token);
      emailVerified = null;
    }
    const defaultPassword = DEFAULT_PASSWORD;
    const hashedPassword = await bcrypt.hash(defaultPassword!, 10);
    const codePrefix = values.role === roleOptions.SELLER ? 'ENSE-' : 'ENSU-';
    await db.user.create({
      data: {
        code: codePrefix + generateCode(),
        fullName: capitalizeWords(values.fullName),
        address: values.address,
        pack: UserPack[values.pack!],
        role: values.role,
        city: values.city,
        state: values.state,
        active: values.active,
        rib: values.rib,
        pickupId: values.pickupId,
        email: values.email,
        storeName: values.storeName ?? 'ECOMNESS',
        number: values.number,
        emailVerified: emailVerified,
        paid: values.paid,
        password: hashedPassword,
      },
    });

    revalidatePath('/dashboard/admin/sellers');
    revalidatePath('/dashboard/admin/suppliers');

    return { success: 'user-save-success' };
  } catch (error) {
    return { error: 'user-save-error' };
  }
};

export const editUser = async (id: string, values: z.infer<typeof UserSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return { error: 'user-not-found-error' };
    }

    if (existingUser.boarded !== 2 && values.boarded === 2) {
      notifyUser(
        existingUser.id,
        NotificationType.DOCUMENTS_APPROVED,
        '/dashboard/' + existingUser.role.toLocaleLowerCase(),
      );
    }
    if ((existingUser.pack as packOptions) !== values.pack && values.paid === true) {
      await db.billing.create({
        data: {
          pack: values.pack as UserPack,
          createdAt: new Date(),
          userId: id,
        },
      });
    }

    if (
      (existingUser.pack as packOptions) === values.pack &&
      existingUser.paid === false &&
      values.paid !== existingUser.paid
    ) {
      await db.billing.create({
        data: {
          pack: values.pack as UserPack,
          createdAt: new Date(),
          userId: id,
        },
      });
    }

    if (values.number !== existingUser.number) {
      const existingNumber = await getUserByNumber(values.number);
      if (existingNumber) {
        return { error: 'existing-user-error' };
      }
    }

    if (values.email.trim() !== existingUser.email) {
      const existingEmail = await getUserByEmail(values.email);
      if (existingEmail) {
        return { error: 'existing-user-error' };
      }
    }
    let emailVerified;

    if (values.emailVerified === true && existingUser.emailVerified === null) {
      emailVerified = new Date();
    }

    if (
      (values.emailVerified === true && existingUser.emailVerified !== null) ||
      (values.emailVerified === false && existingUser.emailVerified === null)
    ) {
      emailVerified = existingUser.emailVerified;
    }

    if (values.emailVerified === false && existingUser.emailVerified !== null) {
      const verificationToken = await generateEmailVerificationToken(values.email.trim());
      await sendEmailVerificationEmail(values.fullName.trim(), verificationToken.email, verificationToken.token);
      emailVerified = null;
    }

    if (existingUser.active === false && values.active === true) {
      await sendAccountActivationEmail(values.fullName.trim(), existingUser.email);
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        fullName: values.fullName,
        address: values.address,
        pack: values.pack,
        city: values.city,
        state: values.state,
        role: values.role,
        active: values.active,
        rib: values.rib,
        pickupId: values.pickupId,
        email: values.email,
        storeName: values.storeName ?? 'ECOMNESS',
        number: values.number,
        emailVerified: emailVerified,
        paid: values.paid,
        boarded: values.boarded,
      },
    });

    revalidatePath('/dashboard/admin/sellers');
    revalidatePath('/dashboard/admin/suppliers');
    return { success: 'user-save-success' };
  } catch (error) {
    return { error: 'user-save-error' };
  }
};

export const deleteUser = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    await db.user.delete({
      where: {
        id: id,
      },
    });

    revalidatePath('/dashboard/admin/sellers');
    revalidatePath('/dashboard/admin/suppliers');
    return { success: 'user-delete-success' };
  } catch (error) {
    return { error: 'user-delete-error' };
  }
};

export const bulkDeleteUsers = async (ids: string[]): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    await db.$transaction(async (transaction) => {
      await transaction.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    });

    revalidatePath('/dashboard/admin/sellers');
    revalidatePath('/dashboard/admin/suppliers');

    return { success: 'users-delete-success' };
  } catch (error) {
    return { error: 'users-delete-error' };
  }
};

export const CompleteOnBoarding = async (values: z.infer<typeof OnBoardingSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.SELLER, UserRole.SUPPLIER]);
    const user = await currentUser();
    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        rib: values.rib,
        storeName: values.storeName,
        CIN1: values.CIN1,
        CIN2: values.CIN2,
        boarded: 1,
      },
    });

    notifyAllAdmins(
      NotificationType.ADMIN_NEW_ON_BOARDING,
      '/dashboard/admin/' + user?.role.toLocaleLowerCase() + 's/' + user?.id,
      user?.name!,
    );

    revalidatePath('/dashboard/seller');
    revalidatePath('/dashboard/supplier');

    return { success: 'user-on-boarding-success' };
  } catch (error) {
    return { error: 'users-on-boarding-error' };
  }
};

export const exportSellers = async (ids?: string[]): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const sellers = await db.user.findMany({
      where: {
        role: UserRole.SELLER,
        ...(ids && ids.length > 0 ? { id: { in: ids } } : {}),
      },
      select: {
        code: true,
        email: true,
        number: true,
        fullName: true,
        createdAt: true,
        address: true,
        state: true,
        storeName: true,
        boarded: true,
        active: true,
        emailVerified: true,
        pack: true,
        balance: true,
        soldOrders: {
          select: {
            id: true,
            subOrders: {
              select: {
                total: true,
                sellerProfit: true,
              },
            },
          },
        },
        withdrawRequests: {
          where: {
            status: 'approved',
          },
          select: {
            amount: true,
          },
        },
      },
    });

    const formattedSellers = sellers.map((seller) => ({
      id: seller.code,
      email: seller.email,
      emailVerified: seller.emailVerified ? 'Yes' : 'No',
      phoneNumber: seller.number,
      storeName: seller.storeName,
      name: seller.fullName,
      city: seller.address,
      state: seller.state,
      pack: seller.pack,
      boarded: seller.boarded,
      active: seller.active ? 'Yes' : 'No',
      createdAt: seller.createdAt,
      ordersCount: seller.soldOrders.length,
      totalRevenue: seller.soldOrders.reduce(
        (sum, order) => sum + order.subOrders.reduce((subSum, subOrder) => subSum + (subOrder.total || 0), 0),
        0,
      ),
      totalProfit: seller.soldOrders.reduce(
        (sum, order) => sum + order.subOrders.reduce((subSum, subOrder) => subSum + (subOrder.sellerProfit || 0), 0),
        0,
      ),
      currentBalance: seller.balance,
      totalWithdrawn: seller.withdrawRequests.reduce((sum, request) => sum + request.amount, 0),
    }));
    console.log(formattedSellers);
    return { success: 'export-success', data: formattedSellers };
  } catch (error) {
    return { error: 'export-error' };
  }
};
