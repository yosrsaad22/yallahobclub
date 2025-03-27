import { OnBoardingGate } from '@/components/auth/on-boarding-gate';
import { RoleGate } from '@/components/auth/role-gate';
import { UserRole } from '@prisma/client';
import * as React from 'react';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGate allowedRole={UserRole.USER}>
      <OnBoardingGate>{children}</OnBoardingGate>
    </RoleGate>
  );
}
