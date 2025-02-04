import { UserRole } from '@prisma/client';
import Unauthorized from '../dashboard/unauthorized/unauthorized';
import { currentRole } from '@/lib/auth';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = async ({ children, allowedRole }: RoleGateProps) => {
  const role = await currentRole();
  if (role !== allowedRole) {
    return Unauthorized();
  }
  return <>{children}</>;
};
