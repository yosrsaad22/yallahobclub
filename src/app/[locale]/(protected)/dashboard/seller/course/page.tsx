import Breadcrumb from '@/components/ui/breadcrumb';
import { IconBrandYoutube } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { CoursePlayer } from '@/components/dashboard/seller/course-player';
import { ActionResponse } from '@/types';
import { Chapter, Course } from '@prisma/client';
import { getChapters, getCourse } from '@/actions/course';
import { getUserProgress } from '@/actions/course';
import { currentUser } from '@/lib/auth';
import { PackGate } from '@/components/auth/pack-gate';
import { packOptions } from '@/lib/constants';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.course'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function SellerCourse() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.course'), link: '/dashboard/seller/course' }];
  const user = await currentUser();
  const fetchChapters: ActionResponse = await getChapters();
  const chaptersData: Chapter[] = fetchChapters.error ? [] : fetchChapters.data;
  const fetchUserProgress: ActionResponse = await getUserProgress(user?.id!);

  const fetchCourse: ActionResponse = await getCourse();
  const courseData: Course = fetchCourse.error ? null : fetchCourse.data;

  const userProgressData: {
    completedChapters: number;
    totalChapters: number;
  } = fetchUserProgress.error ? [] : fetchUserProgress.data;

  return (
    <PackGate allowedPacks={[packOptions.DAMREJ, packOptions.AJEJA, packOptions.BRAND, packOptions.MACHROU3]}>
      <div className="z-10 space-y-4 p-4 pt-6 md:p-6 ">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBrandYoutube className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.course')}</h2>
        </div>
        <CoursePlayer course={courseData} chapters={chaptersData} userProgress={userProgressData} />
      </div>
    </PackGate>
  );
}
