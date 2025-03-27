'use server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';
import { UserSettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById, getUserByNumber } from '@/data/user';

import { revalidatePath } from 'next/cache';
import { currentUser, roleGuard } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { ActionResponse } from '@/types';

export const userEditSettings = async (values: z.infer<typeof UserSettingsSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.USER, UserRole.ADMIN]);

    const user = await currentUser();
    const existingUser = await getUserById(user?.id!);
    if (!existingUser) {
      return { error: 'Utilisateur non trouvé' };
    }

    if (values.newPassword && values.confirmPassword && values.currentPassword) {
      const passwordMatch = await bcrypt.compare(values.currentPassword, existingUser.password);
      if (!passwordMatch) {
        return { error: 'Mot de passe actuel incorrect' };
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
        return { error: 'Ce numéro est déjà utilisé' };
      }
    }

    if (values.email.trim() !== existingUser.email) {
      const existingEmail = await getUserByEmail(values.email);
      if (existingEmail) {
        return { error: 'Cet email est déjà utilisé' };
      }
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        address: values.address,
        fullName: values.fullName,
        number: values.number,
        email: values.email.trim(),
      },
    });

    revalidatePath(`/dashboard/${existingUser.role}/settings`);
    return { success: 'Paramètres enregistrés avec succès' };
  } catch (error) {
    return { error: "Erreur lors de l'enregistrement des paramètres" };
  }
};
