'use server';

import { roleGuard } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChapterSchema, CourseSchema } from '@/schemas';
import { ActionResponse } from '@/types';
import z from 'zod';
import { Chapter, UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getChapterById, getCourseByDefault } from '@/data/course';
import { UTApi } from 'uploadthing/server';

export const getCourse = async (): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const course = await getCourseByDefault();
    if (!course) {
      await db.course.create({
        data: {
          title_en: 'Dropshipping Course',
          title_fr: 'Formation de Dropshipping',
          description_en: 'This is a dropshipping online course',
          description_fr: 'Ceci est une formation en ligne de dropshipping',
        },
      });
    }
    return { success: 'course-fetch-success', data: course };
  } catch (error) {
    return { error: 'course-fetch-error' };
  }
};

export const editCourse = async (
  values: z.infer<typeof CourseSchema>,
  chapters: Chapter[],
): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const existingCourse = await getCourseByDefault();

    if (!existingCourse) return { error: 'course-not-found-error' };

    await db.course.update({
      where: {
        id: existingCourse.id,
      },
      data: {
        title_en: values.title_en,
        title_fr: values.title_fr,
        description_en: values.description_en,
        description_fr: values.description_fr,
      },
    });

    await Promise.all(
      chapters.map(async (chapter) => {
        await db.chapter.update({
          where: {
            id: chapter.id,
          },
          data: {
            position: chapter.position,
          },
        });
      }),
    );

    revalidatePath('/dashboard/admin/course');

    return { success: 'course-save-success' };
  } catch (error) {
    return { error: 'course-save-error' };
  }
};

export const getChapters = async (): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);

    const chapters = await db.chapter.findMany({
      orderBy: {
        position: 'asc',
      },
    });
    return { success: 'chapter-fetch-success', data: chapters };
  } catch (error) {
    return { error: 'chapter-fetch-error' };
  }
};

export const addChapter = async (values: z.infer<typeof ChapterSchema>, position: number): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const course = await db.course.findFirst();
    if (!course) return { error: 'course-not-found-error' };
    const chapter = await db.chapter.create({
      data: {
        title_en: values.title_en,
        title_fr: values.title_fr,
        description_en: values.description_en,
        description_fr: values.description_fr,
        position: position,
        video: values.video,
        courseId: course.id,
      },
    });

    revalidatePath('/dashboard/admin/course');

    return { success: 'chapter-save-success', data: chapter };
  } catch (error) {
    return { error: 'chapter-save-error' };
  }
};

export const editChapter = async (id: string, values: z.infer<typeof ChapterSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const existingChapter = await getChapterById(id);

    if (!existingChapter) return { error: 'chapter-not-found-error' };

    if (existingChapter.video !== values.video) {
      await deleteVideo(existingChapter.video);
    }

    await db.chapter.update({
      where: {
        id: existingChapter.id,
      },
      data: {
        title_en: values.title_en,
        title_fr: values.title_fr,
        description_en: values.description_en,
        description_fr: values.description_fr,
        video: values.video,
      },
    });

    revalidatePath('/dashboard/admin/course');

    return { success: 'chapter-save-success' };
  } catch (error) {
    return { error: 'chapter-save-error' };
  }
};

export const deleteChapter = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.ADMIN);

    const chapter = await getChapterById(id);
    if (!chapter) return { error: 'chapter-not-found-error' };
    await deleteVideo(chapter.video);
    await db.chapter.delete({
      where: {
        id: id,
      },
    });

    revalidatePath('/dashboard/admin/course');
    return { success: 'chapter-delete-success' };
  } catch (error) {
    return { error: 'chapter-delete-error' };
  }
};

export const deleteVideo = async (key: string): Promise<ActionResponse> => {
  const utapi = new UTApi();
  try {
    await roleGuard(UserRole.ADMIN);

    await utapi.deleteFiles(key);
    return { success: 'video-delete-success' };
  } catch (error) {
    return { error: 'video-delete-error' };
  }
};

export const getUserProgress = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);

    const chapters = await db.chapter.findMany({
      orderBy: {
        position: 'asc',
      },
    });

    const userProgress = [];
    for (const chapter of chapters) {
      const progress = await db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: id,
            chapterId: chapter.id,
          },
        },
      });
      userProgress.push(progress);
    }
    let completedChapters = 0;
    for (const progress of userProgress) {
      if (progress && progress.isCompleted) {
        completedChapters++;
      }
    }
    return {
      success: 'user-progress-fetch-success',
      data: { completedChapters: completedChapters, totalChapters: chapters.length },
    };
  } catch (error) {
    return { error: 'user-progress-fetch-error' };
  }
};

export const setChapterCompleted = async (userId: string, chapterId: string): Promise<ActionResponse> => {
  try {
    await roleGuard(UserRole.SELLER);

    const res = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: chapterId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        userId: userId,
        chapterId: chapterId,
        isCompleted: true,
      },
    });
    revalidatePath('/dashboard/seller/course');
    return { success: 'chapter-completed-success' };
  } catch (error) {
    return { error: 'chapter-completed-error' };
  }
};
