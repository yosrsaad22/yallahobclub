import { auth } from '@/auth';
import { UserRole } from '@prisma/client';
import { packOptions } from './constants';

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

export const roleGuard = async (allowedRoles: UserRole | UserRole[]) => {
  const role = await currentRole();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (role === undefined || !roles.includes(role)) {
    throw new Error('Unauthorized');
  }
};

export const packGuard = async (allowedPacks: packOptions | packOptions[]) => {
  const pack = await currentPack();

  const packs = Array.isArray(allowedPacks) ? allowedPacks : [allowedPacks];

  if (pack === undefined || !packs.includes(pack)) {
    throw new Error('Unauthorized');
  }
};
