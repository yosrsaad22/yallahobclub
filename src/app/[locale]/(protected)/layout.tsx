import { auth } from '@/auth';
import Header from '@/components/dashboard/layout/header/header';
import Sidebar from '@/components/dashboard/layout/sidebar/sidebar';
import { ThemeProvider } from '@/providers/theme-provider';
import { SessionProvider } from 'next-auth/react';
import { getTranslations } from 'next-intl/server';
import * as React from 'react';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const session = await auth();
  return (
    <div className="bg-page  text-foreground">
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange={false} enableSystem={true}>
          <div className="flex h-screen w-full flex-row ">
            <Sidebar className="flex-shrink-0 bg-sidebar" />
            <div className="flex w-full flex-col">
              <Header />
              <main className="custom-scrollbar relative mt-0 h-full flex-1 flex-col overflow-auto border-l border-muted bg-page ">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
}
