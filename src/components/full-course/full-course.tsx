'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button, GradientLinkButton } from '../ui/button';
import { localeOptions } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { PricingCard } from './pricing/pricing-card';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface FullCourseComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  chapters: any[];
}

export const FullCourseComponent = ({ chapters }: FullCourseComponentProps) => {
  const t = useTranslations('full-course');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const locale = useLocale();

  const chapterDurations = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 25, 20, 15, 30];
  const chaptersWithDuration = chapters.map((chapter, index) => ({
    ...chapter,
    duration: chapterDurations[index],
  }));

  const images = ['/img/conversation.png', '/img/conversation1.png', '/img/conversation.png'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-24 p-8  md:gap-28 ">
      {/* floating icons */}

      <div className="relative flex w-full flex-col items-center justify-center gap-16">
        <div className="absolute -top-14  left-4 rotate-[7deg] md:left-20  md:top-0">
          <div className="flex animate-float-slow flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/fb.webp" alt="Facebook" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute right-4 top-[50%] rotate-[10deg] md:right-64  md:top-[35%]">
          <div className="flex animate-float-fast flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700   p-3">
              <Image src="/img/meta.webp" alt="Meta" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 rotate-[-10deg] transform md:left-4">
          <div className="flex animate-float-medium flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/insta.webp" alt="Instagram" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute -left-4 top-[15%] rotate-[-6deg] md:left-48  md:top-[25%]">
          <div className="flex animate-float-slow flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/shopify.webp" alt="Shopify" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute right-5 top-[-5%] rotate-[4deg]  md:right-32">
          <div className="flex animate-float-fast flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-2">
              <Image src="/img/canva.webp" alt="Canva" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute right-2 top-[15%] rotate-[-5deg]  md:right-8">
          <div className="flex animate-float-medium flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/tiktk.webp" alt="TikTok" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-16  hidden rotate-[6deg]  md:left-24 md:block">
          <div className="flex animate-float-slow flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/capcut.webp" className="rounded-md" alt="capcut" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-[35%]  hidden rotate-[-10deg]  md:right-24 md:block">
          <div className="flex animate-float-medium flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/google-analytics.webp" alt="Google" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-[30%] hidden rotate-[4deg] md:left-64 md:block">
          <div className="flex animate-float-slow flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/seo.webp" alt="seo" height={36} width={36} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-10  hidden rotate-[6deg]  md:right-56 md:block">
          <div className="flex animate-float-medium flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
              <Image src="/img/megaphone.webp" alt="ads" height={36} width={36} />
            </div>
          </div>
        </div>

        {/* hero section */}
        <div className="flex w-full max-w-[90%] flex-col items-center justify-center gap-8 sm:max-w-[80%] md:max-w-[55%]">
          <h1 className="text-gradient max-w-full translate-y-[-1rem] animate-fade-in py-2 text-center text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:text-[3rem]">
            {t('title')}
            <span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('title-gradient')}
            </span>
          </h1>
          <p className="text-md max-w-[90%] animate-fade-in text-center [--animation-delay:300ms] sm:max-w-[80%] md:max-w-[90%] md:text-lg">
            {t('text')}
          </p>
          <div className="flex w-full animate-fade-in items-center justify-center [--animation-delay:400ms]">
            <GradientLinkButton
              innerClassName="bg-[#24282e] hover:bg-gray-800 active:bg-gray-800 "
              rounded={'full'}
              size={'default'}
              href={'/register'}>
              {t('buy-button')}
            </GradientLinkButton>
          </div>
          <div className="flex w-full justify-center overflow-hidden rounded-xl pt-8">
            <Image
              src={'/img/course.webp'}
              alt="course"
              height={400}
              width={600}
              className="rounded-xl object-cover"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* host section */}

      <div className="relative flex flex-col gap-12 px-4 py-6 md:flex-row md:gap-24 md:px-16">
        <div className=" flex flex-col items-center text-center  md:items-start md:text-left">
          <div className="relative flex h-8 flex-col items-center justify-center">
            <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
            <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-full border border-gray-700  p-2 px-4 text-sm">
              {t('host-meet')}
            </div>
          </div>
          <h1 className="text-gradient w-full translate-y-[-1rem]  animate-fade-in py-2  pt-4 text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:max-w-lg md:text-[3rem]">
            <span className=" bg-gradient-to-r from-primary to-secondary bg-clip-text  text-transparent">
              {t('host-title')}
            </span>
          </h1>
          <p className="text-md max-w-full pt-8 md:max-w-xl ">{t('host-text')}</p>
          <div className="pt-8">
            <GradientLinkButton
              innerClassName="bg-[#24282e] hover:bg-gray-800 active:bg-gray-800 "
              rounded={'full'}
              size={'default'}
              href={'/register'}>
              {t('buy-button')}
            </GradientLinkButton>
          </div>
        </div>
        <div className="relative flex items-end justify-center rounded-md   backdrop-blur-sm">
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/90 to-secondary/90 opacity-70 blur-3xl"></div>
          <Image src={'/img/image-course.png'} className="z-[10]" height={600} width={600} alt="host" />
        </div>
      </div>

      {/* why us section */}

      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="absolute inset-0 mt-4 w-full rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-40 blur-3xl"></div>

        <div className="relative flex h-8 flex-col items-center justify-center">
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
          <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-full border border-gray-700  p-2 px-4 text-sm">
            {t('why-us')}
          </div>
        </div>
        <h1 className="text-gradient max-w-full translate-y-[-1rem] animate-fade-in py-2  pt-4 text-center text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:text-[3rem]">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text  text-transparent">
            {t('why-us-title')}
          </span>
        </h1>
        <div className="grid grid-cols-2 grid-rows-3 gap-6 pt-16 md:grid-cols-3 md:grid-rows-2 md:gap-10">
          <div className="feature-glass-gradient relative flex max-w-[18rem] flex-col items-start justify-start gap-4 rounded-md border border-slate-700/70 p-4 py-5 backdrop-blur-sm ">
            <Image src="/img/learning.webp" alt="learning" height={32} width={32} />
            <h1 className="text-lg font-bold ">{t('learning.title')}</h1>
            <p className="text-sm text-white/90">{t('learning.subtitle')}</p>
          </div>
          <div className="feature-glass-gradient relative flex max-w-[18rem] flex-col items-start justify-start gap-4 rounded-md border border-slate-700/70 p-4 py-5 backdrop-blur-sm ">
            <Image src="/img/coaching.webp" alt="coachnig" height={32} width={32} />

            <h1 className="text-lg font-bold">{t('coaching.title')}</h1>
            <p className="text-sm text-white/90">{t('coaching.subtitle')}</p>
          </div>
          <div className="feature-glass-gradient relative flex max-w-[18rem] flex-col items-start justify-start gap-4 rounded-md border border-slate-700/70 p-4 py-5 backdrop-blur-sm ">
            <Image src="/img/platform.webp" alt="platform" height={32} width={32} />

            <h1 className="text-lg font-bold">{t('platform.title')}</h1>
            <p className="text-sm text-white/90">{t('platform.subtitle')}</p>
          </div>
          <div className="feature-glass-gradient relative flex max-w-[18rem] flex-col items-start justify-start gap-4 rounded-md border border-slate-700/70 p-4 py-5 backdrop-blur-sm ">
            <Image src="/img/trends.webp" alt="trends" height={32} width={32} />

            <h1 className="text-lg font-bold">{t('trends.title')}</h1>
            <p className="text-sm text-white/90">{t('trends.subtitle')}</p>
          </div>

          <div className="feature-glass-gradient relative flex max-w-[18rem] flex-col items-start justify-start gap-4 rounded-md border border-slate-700/70 p-4 py-5 backdrop-blur-sm ">
            <Image src="/img/network.webp" alt="network" height={32} width={32} />

            <h1 className="text-lg font-bold">{t('network.title')}</h1>
            <p className="text-sm text-white/90">{t('network.subtitle')}</p>
          </div>
          <div className="feature-glass-gradient relative flex max-w-[18rem] flex-col items-start justify-start gap-4 rounded-md border border-slate-700/70 p-4 py-5 backdrop-blur-sm ">
            <Image src="/img/support.webp" alt="support" height={32} width={32} />

            <h1 className="text-lg font-bold">{t('support.title')}</h1>
            <p className="text-sm text-white/90">{t('support.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* what you get section */}

      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="absolute inset-0 mt-4 w-full rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-40 blur-3xl"></div>

        <div className="relative flex h-8 flex-col items-center justify-center">
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
          <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-full border border-gray-700  p-2 px-4 text-sm">
            {t('what-you-get')}
          </div>
        </div>
        <h1 className="text-gradient max-w-full translate-y-[-1rem] animate-fade-in py-2  pt-4 text-center text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:text-[3rem]">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text  text-transparent">
            {t('what-you-get-title')}
          </span>
        </h1>
        <p className="text-md pt-8 text-center md:max-w-3xl ">{t('what-you-get-text')}</p>
        <div className="grid grid-cols-2 grid-rows-2 gap-12 pt-16 md:grid-cols-4 md:grid-rows-1 md:gap-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative  flex  w-16 animate-float-slow flex-col items-center justify-center">
              <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
                <Image src="/img/video.webp" alt="ads" height={36} width={36} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="font-semibold">{t('chapters.title')}</h3>
              <p className="text-sm font-normal">{t('chapters.subtitle')}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative  flex w-16 animate-float-medium flex-col items-center justify-center">
              <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
                <Image src="/img/pantone.webp" alt="ads" height={36} width={36} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="font-semibold">{t('brand.title')}</h3>
              <p className="text-sm font-normal">{t('brand.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative flex w-16  animate-float-slow flex-col items-center justify-center">
              <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
                <Image src="/img/headphones.webp" alt="ads" height={36} width={36} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 ">
              <h3 className="text-center font-semibold">{t('followup.title')}</h3>
              <p className="text-sm font-normal">{t('followup.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative flex w-16  animate-float-medium flex-col items-center justify-center">
              <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-xl border border-gray-700  p-3">
                <Image src="/img/chat.webp" alt="ads" height={36} width={36} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="font-semibold">{t('community.title')}</h3>
              <p className="text-sm font-normal">{t('community.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* course content section */}

      <div className="relative flex flex-col items-center justify-center py-16">
        <div className="absolute inset-0 mt-12 w-full rounded-full bg-gradient-to-r from-primary/60 to-secondary/70 opacity-50 blur-3xl"></div>

        <div className="relative flex h-8 flex-col items-center justify-center">
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
          <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-full border border-gray-700  p-2 px-4 text-sm">
            {t('explore-course')}
          </div>
        </div>
        <h1 className="text-gradient max-w-full translate-y-[-1rem] animate-fade-in py-2  pt-4 text-center text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:text-[3rem]">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text  text-transparent md:text-5xl">
            {t('course-hours')}
          </span>
        </h1>
        <p className="text-md pt-8 text-center md:max-w-4xl ">{t('course-content')}</p>
        <div className=" feature-glass-gradient custom-scrollbar relative mt-12 flex w-full min-w-[80%] max-w-full items-end justify-center overflow-y-auto rounded-md border border-slate-700/70 bg-background/20  backdrop-blur-sm md:max-w-[80%]">
          <div className="flex h-full max-h-[20rem] w-full flex-col">
            <div className=" flex w-full flex-col gap-6 p-6">
              {chaptersWithDuration.map((chapter, index) => (
                <React.Fragment key={index}>
                  <p className="text-md flex justify-between text-foreground/90">
                    {locale === localeOptions.FR ? chapter.title_fr : chapter.title_en}
                    <span className="text-md pl-4 font-semibold text-slate-400">{chapter.duration} min</span>
                  </p>
                  {index < chaptersWithDuration.length - 1 && <hr className="my-1 w-full border-slate-700" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* pricing section */}

      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative flex h-8 flex-col items-center justify-center">
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 opacity-50 blur-lg"></div>
          <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-full border border-gray-700  p-2 px-4 text-sm">
            {t('pricing.badge')}
          </div>
        </div>
        <h1 className="text-gradient max-w-full translate-y-[-1rem] animate-fade-in py-2 pt-4  text-center text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:max-w-[60%] md:text-[3rem]">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text  text-transparent">
            {t('pricing.title')}
          </span>
        </h1>
        <p className="text-md pt-8 text-center md:max-w-3xl ">{t('pricing.text')}</p>
        <div className="relative flex w-full flex-col flex-wrap items-center justify-center gap-2 pt-16 md:flex-row">
          <PricingCard
            className="m-1 space-y-8"
            packName="DAMREJ"
            href="/register"
            price="297 DT"
            payOnceText={t('pricing.pay-once')}
            description={t('pricing.damrej.description')}
            features={[t('pricing.damrej.feature1'), t('pricing.damrej.feature2')]}
            buttonText={t('pricing.damrej.button')}
          />
          <PricingCard
            className="m-1 space-y-8"
            packName="3JEJA"
            price="497 DT"
            href="/register"
            payOnceText={t('pricing.pay-once')}
            description={t('pricing.3jeja.description')}
            features={[t('pricing.3jeja.feature1'), t('pricing.3jeja.feature2'), t('pricing.3jeja.feature3')]}
            buttonText={t('pricing.3jeja.button')}
          />
          <PricingCard
            className="m-1 space-y-8"
            href="/register"
            packName="BRAND"
            price="1997 DT"
            payOnceText={t('pricing.pay-once')}
            description={t('pricing.brand.description')}
            features={[
              t('pricing.brand.feature1'),
              t('pricing.brand.feature2'),
              t('pricing.brand.feature3'),
              t('pricing.brand.feature4'),
            ]}
            buttonText={t('pricing.brand.button')}
          />
          <PricingCard
            className="m-1 space-y-8"
            href="/register"
            packName="MACHROU3"
            discount="4500 DT"
            price="3500 DT"
            payOnceText={t('pricing.pay-once')}
            description={t('pricing.machrou3.description')}
            features={[
              t('pricing.machrou3.feature1'),
              t('pricing.machrou3.feature2'),
              t('pricing.machrou3.feature3'),
              t('pricing.machrou3.feature4'),
            ]}
            buttonText={t('pricing.machrou3.button')}
          />
        </div>
      </div>

      {/* testimonials section */}

      <div className="relative flex h-[40rem] flex-col items-center justify-center py-6 ">
        <div className="absolute inset-0 mt-12 w-full rounded-full bg-gradient-to-r from-primary/60 to-secondary/70 opacity-50 blur-3xl"></div>

        <div className="relative flex h-8 flex-col items-center justify-center">
          <div className="feature-glass-gradient relative flex flex-col gap-4 rounded-full border border-gray-700  p-2 px-4 text-sm">
            {t('testimonials')}
          </div>
        </div>
        <h1 className="text-gradient max-w-full translate-y-[-1rem] animate-fade-in py-2 pt-4  text-center text-4xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:max-w-[60%] md:text-[3rem]">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text  text-transparent">
            {t('testimonials-title')}
          </span>
        </h1>
        <p className="text-md pt-8 text-center md:max-w-3xl ">{t('testimonials-text')}</p>

        <div className="relative flex h-full w-full items-center justify-center gap-64 pt-32">
          <Button
            onClick={handleNextImage}
            className="border-2 border-white bg-transparent transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-transparent"
            variant={'outline'}
            size={'icon'}>
            <IconChevronLeft className="h-16 w-16  " />
          </Button>

          <Image
            src={images[currentImageIndex]}
            className="absolute -bottom-[97px] z-0 h-[350px] w-[198px] rounded-xl transition-opacity duration-500 ease-in-out"
            alt="screenshot"
            height={400}
            width={300}
          />
          <Image src="/img/iphone.png" className="z-1 absolute -bottom-14" alt="iPhone" height={400} width={300} />

          <Button
            onClick={handleNextImage}
            className="border-2 border-white bg-transparent transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-transparent"
            variant={'outline'}
            size={'icon'}>
            <IconChevronRight className="h-16 w-16  " />
          </Button>
        </div>
      </div>
    </div>
  );
};
