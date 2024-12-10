import { FullCourseComponent } from '@/components/full-course/full-course';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'full-course' });
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default function FullCourse() {
  const t = useTranslations('full-course');
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <FullCourseComponent />
    </div>
  );
}
