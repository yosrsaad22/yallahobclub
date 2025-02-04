'use client';
import React from 'react';
import { IconDeviceMobile, IconHeadphones, IconPackage, IconShirt } from '@tabler/icons-react';
import { ZapIllustration } from '../../illustrations/zap';
import { motion } from 'framer-motion';
import { ChartIllustration } from '../../illustrations/chart';
import {
  platformBentoVariants4,
  platformBentoVariants1,
  platformBentoVariants3,
  platformBentoVariants2,
} from '@/lib/framer-variants';
import { useTranslations } from 'next-intl';
import { GraphIllustration1 } from '@/components/illustrations/graph1';

export function PlatformBento() {
  const t = useTranslations('home.platform');
  return (
    <div className="relative mt-16 h-full overflow-hidden md:mx-8 md:h-auto lg:mx-16 xl:mx-24 ">
      <div className="scrollbar-track-rounded-ful flex snap-x snap-mandatory gap-6  overflow-x-auto px-8 pb-12 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent scrollbar-thumb-rounded-full md:flex-wrap">
        <BentoOne
          title={t('bento1.title')}
          text={t('bento1.text')}
          order={t('bento1.order')}
          canceled={t('bento1.canceled')}
          inprogress={t('bento1.inprogress')}
          delivered={t('bento1.delivered')}
        />
        <BentoTwo title={t('bento2.title')} text={t('bento2.text')} />
        <BentoThree title={t('bento3.title')} text={t('bento3.text')} />
        <BentoFour
          title={t('bento4.title')}
          text={t('bento4.text')}
          product1={t('bento4.product1')}
          category1={t('bento4.category1')}
          product2={t('bento4.product2')}
          category2={t('bento4.category2')}
          product3={t('bento4.product3')}
          category3={t('bento4.category3')}
        />
      </div>
    </div>
  );
}

export const BentoOne = ({
  title,
  text,
  order,
  canceled,
  inprogress,
  delivered,
}: {
  title: string;
  text: string;
  order: string;
  canceled: string;
  inprogress: string;
  delivered: string;
}) => {
  return (
    <div className="feature-glass-gradient relative flex min-h-[25rem] w-full shrink-0 snap-center flex-col items-center justify-end overflow-hidden rounded-[4rem] border border-transparent-white p-8 text-center md:max-w-[calc(66.66%-12px)] md:basis-[calc(66.66%-12px)] md:p-14">
      <motion.div
        initial="initial"
        whileHover="animate"
        className="my-auto flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2">
        <motion.div
          variants={platformBentoVariants1}
          className="feature-glass-gradient flex flex-row items-center space-x-2 rounded-full border  border-transparent-white p-2 md:p-3">
          <IconPackage className="h-8 w-8 flex-shrink-0 rounded-full text-primary" />
          <div className="flex h-6  w-full flex-row justify-between rounded-full ">
            <p className="text-center text-xs font-semibold text-neutral-300 sm:text-sm">{order} #5856</p>
            <p className="rounded-full border border-secondary px-2 py-0.5 text-xs text-secondary">{canceled}</p>{' '}
          </div>
        </motion.div>
        <motion.div
          variants={platformBentoVariants2}
          className="feature-glass-gradient ml-auto flex w-full flex-row items-center space-x-2 rounded-full border border-transparent-white p-2 md:p-3 ">
          <IconPackage className="h-8 w-8 flex-shrink-0 rounded-full text-primary" />

          <div className="flex h-6  w-full flex-row justify-between rounded-full ">
            <p className="text-center text-xs font-semibold text-neutral-300 sm:text-sm">{order} #1056</p>
            <p className="rounded-full border border-blue-400 px-2 py-0.5 text-xs text-blue-400">{inprogress}</p>
          </div>
        </motion.div>
        <motion.div
          variants={platformBentoVariants1}
          className="feature-glass-gradient flex flex-row items-center space-x-2 rounded-full border border-transparent-white p-2 md:p-3">
          <IconPackage className="h-8 w-8 flex-shrink-0 rounded-full text-primary" />
          <div className="flex h-6  w-full flex-row justify-between rounded-full ">
            <p className="text-center text-xs font-semibold text-neutral-300 sm:text-sm">{order} #2090</p>
            <p className="rounded-full border border-success px-2 py-0.5 text-xs text-success">{delivered}</p>{' '}
          </div>
        </motion.div>
      </motion.div>
      <p className="mb-2 w-full  text-center text-2xl font-semibold md:text-left ">{title}</p>
      <p className="text-md text-primary-text w-full text-center md:text-left">{text}</p>
    </div>
  );
};

export const BentoTwo = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className="feature-glass-gradient relative flex min-h-[25rem] w-full shrink-0 snap-center flex-col items-center justify-end overflow-hidden rounded-[4rem] border border-transparent-white p-8 text-center md:basis-[calc(33.33%-12px)] md:p-14">
      <div className="mask-linear-faded absolute top-[-2rem]">
        <ZapIllustration />
      </div>
      <p className="mb-2 text-2xl font-semibold">{title}</p>
      <p className="text-md text-primary-text">{text}</p>
    </div>
  );
};

export const BentoThree = ({ title, text }: { title: string; text: string }) => {
  -2;
  return (
    <div className="mask-linear-faded feature-glass-gradient group relative flex min-h-[25rem] w-full shrink-0 snap-center flex-col items-center justify-start  overflow-hidden rounded-[4rem] border border-transparent-white text-center md:basis-[calc(33.33%-12px)] ">
      <div className="mt-16 p-8 md:p-14">
        <p className="mb-2 text-2xl font-semibold">{title}</p>
        <p className="text-md text-primary-text">{text}</p>
      </div>
      <div className="pointer-events-none  absolute bottom-4 w-full">
        <GraphIllustration1 />
      </div>
    </div>
  );
};

export const BentoFour = ({
  title,
  text,
  product1,
  category1,
  product2,
  category2,
  product3,
  category3,
}: {
  title: string;
  text: string;
  product1: string;
  category1: string;
  product2: string;
  category2: string;
  product3: string;
  category3: string;
}) => {
  return (
    <div className="feature-glass-gradient relative flex min-h-[25rem] w-full shrink-0 snap-center flex-col items-center justify-start overflow-hidden rounded-[4rem] border border-transparent-white text-center md:max-w-[calc(66.66%-12px)] md:basis-[calc(66.66%-12px)] md:p-14">
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="-gap-x-2 mt-4 flex min-h-[6rem] w-full flex-1 flex-row px-0 py-6 md:gap-x-2 md:px-2 md:py-2">
        <motion.div
          variants={platformBentoVariants3}
          className="feature-glass-gradient flex  h-full w-1/3 flex-col items-center justify-center
         rounded-2xl border border-transparent-white p-4">
          <div className="relative mx-auto flex aspect-square rounded-full p-1  before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 before:bg-white/5 md:p-2">
            <IconShirt className="h-10 w-10 rounded-full text-primary md:h-12 md:w-12" />
          </div>

          <p className="mt-4 text-center text-xs font-semibold text-neutral-300 sm:text-sm">{product1}</p>
          <p className="mt-4 rounded-full border border-primary px-2 py-0.5 text-xs text-primary">{category1}</p>
        </motion.div>
        <motion.div className="feature-glass-gradient relative z-20 flex h-full  w-1/3    flex-col items-center justify-center  rounded-2xl border border-transparent-white p-4">
          <div className="relative mx-auto flex aspect-square rounded-full p-1  before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 before:bg-white/5 md:p-2">
            <IconDeviceMobile className="h-10 w-10 rounded-full text-primary md:h-12 md:w-12" />
          </div>
          <p className="mt-4 text-center text-xs font-semibold text-neutral-300 sm:text-sm">{product2}</p>
          <p className="mt-4 rounded-full border border-primary px-2 py-0.5 text-xs text-primary">{category2}</p>
        </motion.div>
        <motion.div
          variants={platformBentoVariants4}
          className="feature-glass-gradient flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-transparent-white p-4">
          <div className="relative mx-auto flex aspect-square rounded-full p-1  before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 before:bg-white/5 md:p-2">
            <IconHeadphones className="h-10 w-10 rounded-full text-primary md:h-12 md:w-12" />
          </div>
          <p className="mt-4 text-center text-xs font-semibold text-neutral-300 sm:text-sm">{product3}</p>
          <p className="mt-4 rounded-full border border-primary px-2 py-0.5 text-xs text-primary">{category3}</p>
        </motion.div>
      </motion.div>
      <div className="px-8 pb-8">
        <p className="mb-2 mt-4 text-2xl font-semibold">{title}</p>
        <p className="text-md text-primary-text">{text}</p>
      </div>
    </div>
  );
};
