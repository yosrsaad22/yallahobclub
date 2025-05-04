'use server';
import { db } from '@/lib/db';
import { currentUser, roleGuard } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { OnboardingOneSchema, OnboardingThreeSchema, OnboardingTwoSchema, UserSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById, getUserByNumber } from '@/data/user';
import { capitalizeWords } from '@/lib/utils';

const DEFAULT_PASSWORD = 'YALLAHOB';

export const getUsers = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const users = await db.User.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'Utilisateurs récupérés avec succès', data: users };
  } catch (error) {
    return { error: 'Erreur lors de la récupération des utilisateurs' };
  }
};

export const getUser = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const User = await getUserById(id);
    if (!User) return { error: 'Utilisateur non trouvé' };
    return { success: 'Utilisateur récupéré avec succès', data: User };
  } catch (error) {
    return { error: "Erreur lors de la récupération de l'utilisateur" };
  }
};

export const addUser = async (values: z.infer<typeof UserSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const existingNumber = await getUserByNumber(values.number);
    const existingEmail = await getUserByEmail(values.email);

    if (existingNumber || existingEmail) {
      return { error: 'Un utilisateur existe déjà avec ces informations' };
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD!, 10);

    await db.User.create({
      data: {
        fullName: capitalizeWords(values.fullName),
        email: values.email.trim(),
        number: values.number,
        password: hashedPassword,
        address: values.address,
        role: values.role,
      },
    });

    revalidatePath('/dashboard/admin/users');
    return { success: 'Utilisateur créé avec succès' };
  } catch (error) {
    return { error: "Erreur lors de la création de l'utilisateur" };
  }
};

export const editUser = async (id: string, values: z.infer<typeof UserSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return { error: 'Utilisateur non trouvé' };
    }

    if (values.number !== existingUser.number) {
      const existingNumber = await getUserByNumber(values.number);
      if (existingNumber) {
        return { error: 'Un utilisateur existe déjà avec ce numéro' };
      }
    }

    if (values.email.trim() !== existingUser.email) {
      const existingEmail = await getUserByEmail(values.email);
      if (existingEmail) {
        return { error: 'Un utilisateur existe déjà avec cet email' };
      }
    }

    await db.User.update({
      where: { id: existingUser.id },
      data: {
        fullName: values.fullName,
        email: values.email.trim(),
        number: values.number,
        role: values.role,
      },
    });

    revalidatePath('/dashboard/admin/users');
    return { success: 'Utilisateur modifié avec succès' };
  } catch (error) {
    return { error: "Erreur lors de la modification de l'utilisateur" };
  }
};

export const deleteUser = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    await db.User.delete({
      where: {
        id: id,
      },
    });

    revalidatePath('/dashboard/admin/users');
    return { success: 'Utilisateur supprimé avec succès' };
  } catch (error) {
    return { error: "Erreur lors de la suppression de l'utilisateur" };
  }
};

export const updateOnBoardingOne = async (values: z.infer<typeof OnboardingOneSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.USER);

    const user = await currentUser();
    if (!user) {
      return { error: 'Utilisateur non trouvé' };
    }

    await db.User.update({
      where: { id: user.id },
      data: {
        onBoarding: 1,
        firstPartnerName: values.firstPartnerName,
        secondPartnerName: values.secondPartnerName,
      },
    });

    revalidatePath('/dashboard/admin/users');
    return { success: 'Informations enregistrée avec succès' };
  } catch (error) {
    return { error: "Erreur lors de l'enregistrement des info" };
  }
};

export const updateOnBoardingTwo = async (values: z.infer<typeof OnboardingTwoSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.USER);

    const user = await currentUser();
    if (!user) {
      return { error: 'Utilisateur non trouvé' };
    }

    await db.User.update({
      where: { id: user.id },
      data: {
        onBoarding: 2,
        yearsKnownEachOther: values.yearsKnownEachOther,
        yearsMarried: values.yearsMarried,
      },
    });

    revalidatePath('/dashboard/admin/users');
    return { success: 'Informations enregistrée avec succès' };
  } catch (error) {
    return { error: "Erreur lors de l'enregistrement des info" };
  }
};

export const updateOnBoardingThree = async (values: z.infer<typeof OnboardingThreeSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.USER);

    const user = await currentUser();
    if (!user) {
      return { error: 'Utilisateur non trouvé' };
    }

    await db.User.update({
      where: { id: user.id },
      data: {
        onBoarding: 3,
        numberOfChildren: values.numberOfChildren,
      },
    });

    revalidatePath('/dashboard/admin/users');
    return { success: 'Informations enregistrée avec succès' };
  } catch (error) {
    return { error: "Erreur lors de l'enregistrement des info" };
  }
};
