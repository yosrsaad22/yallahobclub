'use client';

import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Container } from '../ui/container';
import { LinearButton } from '../ui/linear-button';
import { useTranslations } from 'next-intl';
import { MarketingIcon } from '../icons/marketing';
import { BrandingIcon } from '../icons/branding';
import { CommunityIcon } from '../icons/community';
import { EcommerceIcon } from '../icons/ecommerce';
import { GradientLinkButton } from '../ui/button';

type FeaturesProps = {
  children: React.ReactNode;
  color: string;
  colorDark: string;
  showSparkles: boolean;
};

export const Features = ({ children, color, colorDark, showSparkles }: FeaturesProps) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <div
      ref={ref}
      className={cn(
        'after:bg-[radial-gradient(ellipse_100%_40%_at_50%_60%,rgba(var(--feature-color),0.1),transparent) relative  -mt-[10rem] flex flex-col items-center overflow-x-clip before:pointer-events-none before:absolute before:h-[30rem] before:w-full before:bg-[conic-gradient(from_90deg_at_80%_50%,#000212,rgb(var(--feature-color-dark))),conic-gradient(from_270deg_at_20%_50%,rgb(var(--feature-color-dark)),#000212)] before:bg-no-repeat before:transition-[transform,opacity] before:duration-1000 before:ease-in before:[background-position:1%_0%,99%_0%] before:[background-size:50%_100%,50%_100%] before:[mask:radial-gradient(100%_50%_at_center_center,_black,_transparent)] after:pointer-events-none after:absolute after:inset-0 md:-mt-[5rem]',
        inView && 'is-visible before:opacity-100 before:[transform:rotate(180deg)_scale(2)]',
        !inView && 'before:rotate-180 before:opacity-40',
      )}
      style={
        {
          '--feature-color': color,
          '--feature-color-dark': colorDark,
        } as React.CSSProperties
      }>
      <div className="relative mt-[10rem] w-full">{children}</div>
    </div>
  );
};

type MainFeatureProps = {
  badge: string;
  title: React.ReactNode;
  text: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  children?: React.ReactNode;
};

export const MainFeature = ({
  badge,
  title,
  text,
  children,
  showButton = false,
  buttonText,
  buttonLink,
}: MainFeatureProps) => {
  return (
    <>
      <div className="relative before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_50%_at_center,rgba(var(--feature-color-dark),0.100),transparent)]">
        <Container className={cn('max-w-[90%] pt-[10rem] text-center')}>
          <LinearButton className="translate-y-[40%]" variant="secondary" size="medium">
            <span>{badge}</span>
          </LinearButton>
          <h1 className="text-gradient translate-y-[40%] pt-[3rem] text-center text-4xl font-medium leading-snug [transition:transform_1000ms_cubic-bezier(0.3,_1.17,_0.55,_0.99)_0s] md:text-[4rem] [.is-visible_&]:translate-y-0">
            {title}
          </h1>
        </Container>
      </div>
      <Container className="w-[78rem] max-w-[90%] text-center">
        <p className="text-md mx-auto mb-16 mt-2 font-normal text-foreground/90 md:w-[80%] md:text-xl ">{text}</p>
        {showButton && (
          <div className="mb-16">
            <GradientLinkButton
              size={'lg'}
              href={buttonLink!}
              innerClassName="bg-background hover:bg-gray-800 active:bg-gray-800">
              {buttonText}
            </GradientLinkButton>
          </div>
        )}

        <hr className="mb-0 h-[1px] border-none bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2)_50%,transparent)]" />
        {children}
      </Container>
    </>
  );
};

export const FeatureGrid = () => {
  const t = useTranslations('home.course.grid');
  return (
    <Container>
      <div className="mb-8 grid w-full grid-cols-1 place-items-center gap-x-4 gap-y-16 p-6 md:grid-cols-2 md:gap-x-24 md:text-lg">
        <div className="max-w-[25.6rem] text-center  md:text-left [&_svg]:mb-[4px] md:[&_svg]:mb-[2px] md:[&_svg]:mr-[6px] md:[&_svg]:inline">
          <p className="flex flex-col items-center gap-y-2 text-white md:inline-block">
            <BrandingIcon />
            <span className="mb-2 block font-medium text-white/90 md:inline ">{t('branding.title')}</span>
            <span className="text-white/70"> {t('branding.text')}</span>
          </p>
        </div>
        <div className="max-w-[25.6rem] text-center  md:text-left [&_svg]:mb-[4px] md:[&_svg]:mb-[2px] md:[&_svg]:mr-[6px] md:[&_svg]:inline">
          <p className="flex flex-col items-center gap-y-2 text-white md:inline-block">
            <MarketingIcon />
            <span className="mb-2 block font-medium text-white/90 md:inline ">{t('marketing.title')}</span>
            <span className="text-white/70"> {t('marketing.text')}</span>
          </p>
        </div>
        <div className="max-w-[25.6rem] text-center  md:text-left [&_svg]:mb-[4px] md:[&_svg]:mb-[2px] md:[&_svg]:mr-[6px] md:[&_svg]:inline">
          <p className="flex flex-col items-center gap-y-2 text-white md:inline-block">
            <EcommerceIcon />
            <span className="mb-2 block font-medium text-white/90 md:inline ">{t('ecommerce.title')}</span>
            <span className="text-white/70"> {t('ecommerce.text')}</span>
          </p>
        </div>
        <div className="max-w-[25.6rem] text-center  md:text-left [&_svg]:mb-[4px] md:[&_svg]:mb-[2px] md:[&_svg]:mr-[6px] md:[&_svg]:inline">
          <p className="flex flex-col items-center gap-y-2 text-white md:inline-block">
            <CommunityIcon />
            <span className="mb-2 block font-medium text-white/90 md:inline ">{t('community.title')}</span>
            <span className="text-white/70"> {t('community.text')}</span>
          </p>
        </div>
      </div>
    </Container>
  );
};
