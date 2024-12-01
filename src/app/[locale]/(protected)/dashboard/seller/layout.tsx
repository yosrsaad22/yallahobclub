import { OnBoardingGate } from '@/components/auth/on-boarding-gate';
import { RoleGate } from '@/components/auth/role-gate';
import Footer from '@/components/dashboard/layout/footer/footer';
import { QueryProvider } from '@/providers/query-provider';
import { UserRole } from '@prisma/client';
import * as React from 'react';

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGate allowedRole={UserRole.SELLER}>
      <OnBoardingGate>
        <QueryProvider>{children}</QueryProvider>{' '}
        <div className=" p-4 md:p-6">
          <Footer />
        </div>
      </OnBoardingGate>
    </RoleGate>
  );
}
