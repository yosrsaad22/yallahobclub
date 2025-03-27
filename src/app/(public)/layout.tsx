import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="text-foreground">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
