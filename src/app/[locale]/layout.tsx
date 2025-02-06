import { DM_Sans } from 'next/font/google';
import '../globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Toaster } from '@/components/ui/toaster';
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = DM_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning={true}>
      <GoogleAnalytics gaId="G-H0129EEQ3P" />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body
          className={
            inter.className +
            '  bg-[hsl(0,0%,100%)] scrollbar-thin scrollbar-track-[hsl(213,27%,10%)] scrollbar-thumb-[hsl(0,0%,14.9%)] scrollbar-track-rounded-full scrollbar-thumb-rounded-full'
          }>
          <NextTopLoader showSpinner={false} color="#2ab8bc" />
          {children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
