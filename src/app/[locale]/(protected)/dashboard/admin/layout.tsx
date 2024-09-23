import { RoleGate } from '@/components/auth/role-gate';
import { UserRole } from '@prisma/client';
import * as React from 'react';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleGate allowedRole={UserRole.ADMIN}>{children}</RoleGate>;
}
