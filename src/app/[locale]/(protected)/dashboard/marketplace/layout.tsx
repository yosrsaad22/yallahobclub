import Footer from '@/components/dashboard/layout/footer/footer';
import { QueryProvider } from '@/providers/query-provider';
import * as React from 'react';

export default async function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex w-full flex-col space-y-12 p-4 pt-6 md:p-6">
        <QueryProvider>{children}</QueryProvider>
        <Footer />
      </div>
    </div>
  );
}
