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

export const roleGuard = async (allowedRoles: UserRole | UserRole[]) => {
  const role = await currentRole();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (role === undefined || !roles.includes(role)) {
    throw new Error('Unauthorized');
  }
};
