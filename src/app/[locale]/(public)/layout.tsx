import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BodyStyle } from '@/components/auth/body-style';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" page-gradient dark bg-[hsl(213,27%,10%)] pt-[4.1rem] text-foreground">
      <React.Suspense fallback={null}>
        <BodyStyle backgroundColor="hsl(213,27%,10%)" />
      </React.Suspense>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
