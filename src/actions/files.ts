import { db } from '@/lib/db';
import { UTApi } from 'uploadthing/server';

const cleanOrphanFiles = async () => {
  const videoKey = process.env.FREE_COURSE_KEY;
  const [products, chapters, users, courses] = await Promise.all([
    db.product.findMany({
      select: {
        images: true,
      },
    }),
    db.chapter.findMany({
      select: {
        video: true,
      },
    }),
    db.user.findMany({
      select: {
        image: true,
      },
    }),
    db.course.findMany({
      select: {
        image: true,
      },
    }),
  ]);

  const usedFiles = new Set<string>();

  products.forEach((product) => {
    product.images.forEach((image) => usedFiles.add(image));
  });

  chapters.forEach((chapter) => {
    if (chapter.video) usedFiles.add(chapter.video);
  });

  users.forEach((user) => {
    if (user.image) usedFiles.add(user.image);
  });

  courses.forEach((course) => {
    if (course.image) usedFiles.add(course.image);
  });
  if (videoKey) {
    usedFiles.add(videoKey);
  }
  const utapi = new UTApi();
  console.log(usedFiles);
  const allFiles = (await utapi.listFiles()).files;
  const unusedFiles = allFiles.filter((file) => !usedFiles.has(file.key));

  if (unusedFiles.length > 0) {
    await utapi.deleteFiles(unusedFiles.map((file) => file.key));
    return { success: `Deleted ${unusedFiles.length} unused files from storage.` };
  } else {
    return { info: `No orphan files to delete found` };
  }
};

export default cleanOrphanFiles;
