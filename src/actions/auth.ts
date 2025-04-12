'use server';

import { signIn, signOut } from '@/auth';
import { getUserByEmail, getUserByNumber } from '@/data/user';
import { db } from '@/lib/db';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { ActionResponse } from '@/types';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { capitalizeWords } from '@/lib/utils';

export const register = async (values: z.infer<typeof RegisterSchema>): Promise<ActionResponse> => {
  const hashedPassword = await bcrypt.hash(values.password, 10);
  const existingEmail = await getUserByEmail(values.email.toLowerCase());
  const existingNumber = await getUserByNumber(values.number);

  if (existingEmail || existingNumber) {
    return { error: 'Un utilisateur existe déjà avec ces informations' };
  }

  await db.User.create({
    data: {
      fullName: capitalizeWords(values.fullName.trim()),
      email: values.email.trim().toLowerCase(),
      number: values.number,
      address: values.address.trim(),
      password: hashedPassword,
      role: values.role,
    },
  });

  return { success: 'Utilisateur enregistré avec succès' };
};

export const login = async (values: z.infer<typeof LoginSchema>): Promise<ActionResponse> => {
  let { email, password } = values;
  email = email.trim().toLowerCase();

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Identifiants invalides' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    // ✅ Admin redirect
    const isAdmin = email === 'yosrsaad367@gmail.com';
    const redirectPath = isAdmin ? '/dashboard/admin' : '/dashboard';

    return { data: redirectPath };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case 'bad-credentials-error':
          return { error: 'Identifiants invalides' };
        case 'email-not-verified-error':
          return { error: 'Email non vérifié' };
        case 'user-not-active-error':
          return { error: 'Utilisateur non actif' };
        default:
          return { error: 'Une erreur est survenue' };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut();
};
