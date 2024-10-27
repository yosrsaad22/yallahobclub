import { RoleGate } from '@/components/auth/role-gate';
import Footer from '@/components/dashboard/layout/footer/footer';
import { UserRole } from '@prisma/client';
import * as React from 'react';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      {children}
      <div className="p-4 md:p-6">
        <Footer />
      </div>
    </RoleGate>
  );
}
