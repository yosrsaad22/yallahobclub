import { StarsIllustration } from '@/components/illustrations/stars';
import { Platform } from '@/components/home/platform/platform';
import { Hero } from '@/components/home/hero/hero';
import { Partners } from '@/components/home/partners/partners';
import { WhatWeOffer } from '@/components/home/whatweoffer/whatweoffer';
import { cn } from '@/lib/utils';
import { Course } from '@/components/home/course/course';
import { Cta } from '@/components/home/cta/cta';
import { Testimonials } from '@/components/home/testimonials/testimonials';
import { getTranslations } from 'next-intl/server';
import { FAQ } from '@/components/home/faq/faq';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping ', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default function Home() {
  return (
    <div className="page-gradient dark bg-[hsl(213,27%,10%)] pt-[4.1rem] text-foreground/90 ">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <div
          className={cn(
            'mask-radial-faded pointer-events-none relative z-[-1] my-[-12.8rem] h-[40rem] overflow-hidden',
            'before:absolute before:inset-0 before:bg-radial-faded before:opacity-[0.2]',
            'after:absolute after:-left-1/2 after:top-1/2 after:h-[142.8%] after:w-[200%] after:rounded-[50%] after:border-t after:border-[rgba(120,_119,_198,_0.4)] after:bg-background',
          )}>
          <StarsIllustration />
        </div>
        <WhatWeOffer />
        <Course />
        <Platform />
        <Testimonials />
        <FAQ />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
