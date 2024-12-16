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

  const chaptersData = fetchChapters.error ? [] : fetchChapters.data;
  return (
    <div className="mt-12 flex min-h-screen w-full items-start justify-center">
      <FullCourseComponent chapters={chaptersData} />
    </div>
  );
}
