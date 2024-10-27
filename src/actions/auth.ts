'use server';
import { signIn } from '@/auth';
import { getUserByEmail, getUserById, getUserByNumber } from '@/data/user';
import { BadCredentialsError, EmailNotVerifiedError, UserNotActiveError } from '@/lib/auth-error';
import { db } from '@/lib/db';
import { sendEmailVerificationEmail } from '@/lib/mail';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';
import { getEmailVerificationTokenbyToken } from '@/data/email-verification-token';
import { generatePasswordResetToken } from '@/lib/tokens';
import { getPasswordResetTokenbyToken } from '@/data/password-reset-token';
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from '@/schemas';
import { ActionResponse } from '@/types';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signOut } from '@/auth';
import bcrypt from 'bcryptjs';
import { notifyAllAdmins } from './notifications';
import { NotificationType, UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { capitalizeWords } from '@/lib/utils';
import { roleGuard } from '@/lib/auth';

export const register = async (values: z.infer<typeof RegisterSchema>): Promise<ActionResponse> => {
  const hashedPassword = await bcrypt.hash(values.password, 10);
  const existingEmail = await getUserByEmail(values.email);

  const existingNumber = await getUserByNumber(values.number);

  if (existingEmail || existingNumber) {
    return { error: 'existing-user-error' };
  }
  /* switch (values.pack) {
    case UserPack.DAMREJ:
 */
  const newUser = await db.user.create({
    data: {
      fullName: capitalizeWords(values.fullName.trim()),
      email: values.email.trim(),
      number: values.number,
      address: values.address.trim(),
      password: hashedPassword,
      pack: values.pack,
    },
  });

  const verificationToken = await generateEmailVerificationToken(values.email);

  await sendEmailVerificationEmail(values.fullName, verificationToken.email, verificationToken.token);

  await notifyAllAdmins(NotificationType.ADMIN_NEW_SELLER, `/dashboard/admin/sellers/${newUser.id}`, values.fullName);

  revalidatePath('/dashboard/admin/sellers');

  return { success: 'register-success' };

  // TODO : Implement online payment
  /*  default:
      return { error: 'payment-needed-error' };
  }
  */
};

export const login = async (values: z.infer<typeof LoginSchema>): Promise<ActionResponse> => {
  let { email, password } = values;
  email = email.trim();
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'bad-credentials-error' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { data: existingUser.role };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.cause?.err?.constructor) {
        case BadCredentialsError:
          return { error: error.cause?.err?.message };
        case EmailNotVerifiedError:
          const verificationToken = await generateEmailVerificationToken(values.email);
          await sendEmailVerificationEmail(existingUser.fullName, verificationToken.email, verificationToken.token);
          return { error: error.cause?.err?.message };
        case UserNotActiveError:
          return { error: error.cause?.err?.message };
        default:
          return { error: 'unknown-error' };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut({
    redirect: false,
  });
};

export const forgotPassword = async (values: z.infer<typeof ForgotPasswordSchema>): Promise<ActionResponse> => {
  const email = values.email.trim();

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: 'email-not-found-error' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(existingUser.fullName, passwordResetToken.email, passwordResetToken.token);

  return { success: 'forgot-password-email-successful' };
};

export const ResetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token: string,
): Promise<ActionResponse> => {
  const existingToken = await getPasswordResetTokenbyToken(token);

  if (!existingToken) {
    return { error: 'password-reset-token-unexistant-error' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'password-reset-token-expired-error' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'password-reset-token-email-changed-error' };
  }

  const hashedPassword = await bcrypt.hash(values.password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: 'password-reset-success',
  };
};

export const EmailVerification = async (token: string): Promise<ActionResponse> => {
  const existingToken = await getEmailVerificationTokenbyToken(token);

  if (!existingToken) {
    return { error: 'email-verification-token-unexistant-error' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'email-verification-token-expired-error' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'email-verification-token-email-changed-error' };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.emailVerificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: 'email-verification-success',
  };
};
