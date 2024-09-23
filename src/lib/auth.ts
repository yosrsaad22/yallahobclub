import { auth } from '@/auth';
import { UserRole } from '@prisma/client';

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};

export const currentPack = async () => {
  const session = await auth();
  return session?.user?.pack;
};

export const roleGuard = async (allowedRole: UserRole) => {
  const role = await currentRole();
  if (role !== allowedRole) return { error: 'unauthorized-error' };
};
