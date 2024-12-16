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
  // Mock chapters data if fetchChapters has an error
  if (fetchChapters.error) {
    fetchChapters.data = [
      { id: 1, title_en: 'Introduction to Dropshipping', content: 'Learn the basics of dropshipping.' },
      { id: 2, title_en: 'Setting Up Your Store', content: 'Step-by-step guide to setting up your online store.' },
      { id: 3, title_en: 'Finding Suppliers', content: 'How to find reliable suppliers for your products.' },
      { id: 4, title_en: 'Marketing Strategies', content: 'Effective marketing strategies to boost your sales.' },
      { id: 5, title_en: 'Managing Orders', content: 'Tips on managing orders and customer service.' },
    ];
  }
  const chaptersData = fetchChapters.error ? [] : fetchChapters.data;
  return (
    <div className="mt-12 flex min-h-screen w-full items-start justify-center">
      <FullCourseComponent
        chapters={[
          { id: 1, title_en: 'Introduction to Dropshipping', content: 'Learn the basics of dropshipping.' },
          { id: 2, title_en: 'Setting Up Your Store', content: 'Step-by-step guide to setting up your online store.' },
          { id: 3, title_en: 'Finding Suppliers', content: 'How to find reliable suppliers for your products.' },
          { id: 4, title_en: 'Marketing Strategies', content: 'Effective marketing strategies to boost your sales.' },
          { id: 5, title_en: 'Managing Orders', content: 'Tips on managing orders and customer service.' },
          { id: 5, title_en: 'Managing Orders', content: 'Tips on managing orders and customer service.' },

          { id: 5, title_en: 'Managing Orders', content: 'Tips on managing orders and customer service.' },

          { id: 5, title_en: 'Managing Orders', content: 'Tips on managing orders and customer service.' },

          { id: 5, title_en: 'Managing Orders', content: 'Tips on managing orders and customer service.' },
        ]}
      />
    </div>
  );
}
