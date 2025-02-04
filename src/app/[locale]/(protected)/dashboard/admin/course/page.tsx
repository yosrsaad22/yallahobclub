import Breadcrumb from '@/components/ui/breadcrumb';
import { IconBrandYoutube } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ActionResponse } from '@/types';
import { addChapter, deleteChapter, editChapter, getChapters, getCourse } from '@/actions/course';
import { Chapter as ChapterModel, Course as CourseModel } from '@prisma/client';
import { CourseForm } from '@/components/dashboard/forms/course-form';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.course'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function AdminCourse() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.course'), link: '/dashboard/admin/course' }];
  const fetchCourse: ActionResponse = await getCourse();
  const courseData: CourseModel = fetchCourse.error ? [] : fetchCourse.data;
  const fetchChapters: ActionResponse = await getChapters();
  const chaptersData: ChapterModel[] = fetchChapters.error ? [] : fetchChapters.data;

  const handleChapterDelete = async (id: string) => {
    'use server';
    const res = await deleteChapter(id);
    return res;
  };

  const handleChapterAdd = async (data: any): Promise<ActionResponse> => {
    'use server';
    const res = await addChapter(data, data.position);
    return res;
  };

  const handleChapterEdit = async (data: any) => {
    'use server';
    const res = await editChapter(data.id, data);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBrandYoutube className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.course')}</h2>
        </div>
        <CourseForm
          courseData={courseData}
          chaptersData={chaptersData}
          onChapterAdd={handleChapterAdd}
          onChapterEdit={handleChapterEdit}
          onChapterDelete={handleChapterDelete}
        />
      </div>
    </div>
  );
}
