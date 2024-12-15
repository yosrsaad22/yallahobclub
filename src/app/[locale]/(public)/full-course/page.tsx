import { getPublicChapters } from '@/actions/course';
import { FullCourseComponent } from '@/components/full-course/full-course';
import { ActionResponse } from '@/types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'full-course' });
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function FullCourse() {
  const fetchChapters: ActionResponse = await getPublicChapters();
  const dummyChapters = [
    {
      id: 1,
      title_en: 'Introduction to Dropshipping',
      title_fr: 'Introduction to Dropshipping',

      description_en:
        'Learn the basics of dropshipping and how to get started Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started. ',
      description_fr:
        'Apprenez les bases du dropshipping et comment commencer. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.',
    },
    {
      id: 1,
      title_en: 'Introduction to Dropshipping',
      title_fr: 'Introduction to Dropshipping',

      description_en:
        'Learn the basics of dropshipping and how to get started Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started. ',
      description_fr:
        'Apprenez les bases du dropshipping et comment commencer. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.',
    },
    {
      id: 1,
      title_en: 'Introduction to Dropshipping',
      title_fr: 'Introduction to Dropshipping',

      description_en:
        'Learn the basics of dropshipping and how to get started Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started. ',
      description_fr:
        'Apprenez les bases du dropshipping et comment commencer. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.',
    },
    {
      id: 1,
      title_en: 'Introduction to Dropshipping',
      title_fr: 'Introduction to Dropshipping',

      description_en:
        'Learn the basics of dropshipping and how to get started Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started.Learn the basics of dropshipping and how to get started. ',
      description_fr:
        'Apprenez les bases du dropshipping et comment commencer. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started. Learn the basics of dropshipping and how to get started.',
    },
  ];

  const chaptersData = fetchChapters.error ? dummyChapters : fetchChapters.data;
  return (
    <div className="mt-12 flex min-h-screen w-full items-start justify-center">
      <FullCourseComponent chapters={dummyChapters} />
    </div>
  );
}
