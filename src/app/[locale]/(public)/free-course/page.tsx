import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { FreeCourseForm } from '@/components/free-course/free-course-form';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'free-course' });
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default function FreeCourse() {
  const videoKey = process.env.FREE_COURSE_KEY;

  const t = useTranslations('free-course');
  return (
    <div className=" mt-32 h-full min-h-screen w-full">
      <div className="flex w-full flex-col items-center justify-center px-8 text-center md:pb-0">
        <h1 className="text-gradient  mx-2 max-w-full translate-y-[-1rem] animate-fade-in text-3xl font-semibold leading-none opacity-0 [--animation-delay:200ms] md:max-w-[60%] md:text-[3rem]">
          {t('title')}
          <span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('title-gradient')}
          </span>
        </h1>
        <p className="mb-0 mt-16 max-w-3xl translate-y-[-1rem] animate-fade-in text-center text-lg font-medium text-foreground/80 opacity-0 [--animation-delay:400ms]  md:mb-8 md:text-center">
          {t('text')}
        </p>
      </div>
      <FreeCourseForm videoKey={videoKey ?? ''} />
    </div>
  );
}
