'use server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';
import { AdminSettingsSchema, UserSettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById, getUserByNumber } from '@/data/user';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { sendEmailVerificationEmail } from '@/lib/mail';
import { revalidatePath } from 'next/cache';
import { currentUser, roleGuard } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { ActionResponse } from '@/types';

export const adminGetCompanyInfo = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const companyInfo = await db.companyInfo.findUnique({ where: { companyName: 'ECOMNESS' } });
    return { success: 'company-fetch-success', data: companyInfo };
  } catch (error) {
    return { error: 'company-fetch-error' };
  }
};

export const adminEditSettings = async (values: z.infer<typeof AdminSettingsSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const user = await currentUser();
    const existingUser = await getUserById(user?.id!);
    if (!existingUser) {
      return { error: 'user-not-found-error' };
    }

    if (values.newPassword && values.confirmPassword && values.currentPassword) {
      const passwordMatch = await bcrypt.compare(values.currentPassword, existingUser.password);
      if (!passwordMatch) {
        return { error: 'current-password-error' };
      }
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      });
    }

    if (values.number !== existingUser.number) {
      const existingNumber = await getUserByNumber(values.number);
      if (existingNumber) {
        return { error: 'existing-user-error' };
      }
    }
    let emailVerified = existingUser.emailVerified;

    if (values.email.trim() !== existingUser.email) {
      const existingEmail = await getUserByEmail(values.email);
      if (existingEmail) {
        return { error: 'existing-user-error' };
      }
      emailVerified = null;
      const verificationToken = await generateEmailVerificationToken(values.email.trim());
      await sendEmailVerificationEmail(values.fullName.trim(), verificationToken.email, verificationToken.token);
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        address: values.address,
        fullName: values.fullName,
        state: values.state,
        city: values.city,
        number: values.number,
        email: values.email.trim(),
        emailVerified: emailVerified,
      },
    });

    // Company info change logic
    const companyInfo = await adminGetCompanyInfo();
    if (companyInfo.data) {
      await db.companyInfo.update({
        where: { companyName: 'ECOMNESS' },
        data: { rib: values.rib, tva: values.tva, fiscalId: values.fiscalId },
      });
    } else {
      await db.companyInfo.create({
        data: {
          companyName: 'ECOMNESS',
          rib: values.rib,
          tva: values.tva,
          fiscalId: values.fiscalId,
        },
      });
    }

    revalidatePath('/dashboard/admin/settings');
    return { success: 'settings-save-success' };
  } catch (error) {
    return { success: 'settings-save-error' };
  }
};

export const userEditSettings = async (values: z.infer<typeof UserSettingsSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.SELLER || UserRole.SUPPLIER);

    const user = await currentUser();
    const existingUser = await getUserById(user?.id!);
    if (!existingUser) {
      return { error: 'user-not-found-error' };
    }

    if (values.newPassword && values.confirmPassword && values.currentPassword) {
      const passwordMatch = await bcrypt.compare(values.currentPassword, existingUser.password);
      if (!passwordMatch) {
        return { error: 'current-password-error' };
      }
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      });
    }

    if (values.number !== existingUser.number) {
      const existingNumber = await getUserByNumber(values.number);
      if (existingNumber) {
        return { error: 'existing-user-error' };
      }
    }
    let emailVerified = existingUser.emailVerified;

    if (values.email.trim() !== existingUser.email) {
      const existingEmail = await getUserByEmail(values.email);
      if (existingEmail) {
        return { error: 'existing-user-error' };
      }
      emailVerified = null;
      const verificationToken = await generateEmailVerificationToken(values.email.trim());
      await sendEmailVerificationEmail(values.fullName.trim(), verificationToken.email, verificationToken.token);
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        address: values.address,
        fullName: values.fullName,
        number: values.number,
        state: values.state,
        city: values.city,
        email: values.email.trim(),
        storeName: values.storeName ?? 'ECOMNESS',
        emailVerified: emailVerified,
        pack: values.pack,
      },
    });

    revalidatePath(`/dashboard/${existingUser.role}/settings`);
    return { success: 'settings-save-success' };
  } catch (error) {
    return { error: 'settings-save-error' };
  }
};
