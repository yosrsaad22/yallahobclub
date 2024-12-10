'use client';
import { useTranslations } from 'next-intl';
import React from 'react';

interface FullCourseComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FullCourseComponent = ({}: FullCourseComponentProps) => {
  const t = useTranslations('full-course');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');

  return (
    <div className="-mt-12 flex w-full flex-col items-center justify-center">
      <h1 className="text-gradient  mx-2 max-w-full translate-y-[-1rem] animate-fade-in text-center text-3xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:max-w-[60%] md:text-[3rem]">
        <span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t('title-gradient')}
        </span>
      </h1>
    </div>
  );
};
