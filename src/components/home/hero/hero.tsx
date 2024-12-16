import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import StarsCanvas from './stars-background';
import { HeroImage } from './hero-image';
import { GradientLinkButton } from '@/components/ui/button';

export const Hero = ({ className }: { className?: string }) => {
  const t = useTranslations('home.hero');
  return (
    <section
      id="home"
      className={cn(
        'relative mb-32 flex h-full w-full flex-col items-center justify-center overflow-visible rounded-md p-4 px-6 antialiased',
        className,
      )}>
      <StarsCanvas props="absolute" />
      <div className="z-[5] mx-auto mb-6 mt-2 flex max-w-4xl flex-col items-center justify-center py-8 text-center">
        <h1 className="translate-y-[-1rem] animate-fade-in bg-gradient-to-t from-gray-800 via-white/50 to-white bg-clip-text text-5xl font-semibold leading-none text-transparent [--animation-delay:200ms] md:text-[4.5rem]">
          {t('title')} <br />{' '}
          <span className="mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('title-gradient')}
          </span>
        </h1>
        <p className="text-md mt-8 translate-y-[-1rem] animate-fade-in font-normal text-foreground/90 opacity-0 [--animation-delay:400ms] md:text-xl">
          {t('text')}
        </p>
        <div className="my-12">
          <GradientLinkButton
            innerClassName="bg-[#2d353d] hover:bg-gray-700 active:bg-gray-700"
            size="lg"
            href={'/register'}>
            {t('button')}
          </GradientLinkButton>
        </div>
      </div>
      <HeroImage />
    </section>
  );
};
