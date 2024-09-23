import { RoleGate } from '@/components/auth/role-gate';
import { UserRole } from '@prisma/client';
import * as React from 'react';

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RoleGate allowedRole={UserRole.SELLER}>{children}</RoleGate>;
}
