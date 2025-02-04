import { db } from '@/lib/db';

export const getCourseByDefault = async () => {
  try {
    const course = await db.course.findFirst();
    return course;
  } catch {
    return null;
  }
};

export const getChapterById = async (id: string) => {
  try {
    const chapter = await db.chapter.findUnique({ where: { id } });
    return chapter;
  } catch {
    return null;
  }
};
