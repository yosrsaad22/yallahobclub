import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = DM_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html className="scroll-smooth" suppressHydrationWarning={true}>
      <body className={inter.className + '  bg-white text-foreground'}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
