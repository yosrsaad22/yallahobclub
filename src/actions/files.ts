import { db } from '@/lib/db';
import { UTApi } from 'uploadthing/server';

const cleanOrphanFiles = async () => {
  const videoKey = process.env.FREE_COURSE_KEY;
  const [products, chapters, users, courses] = await Promise.all([
    db.product.findMany({
      select: {
        media: true,
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
    product.media.forEach((media) => usedFiles.add(media.key));
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

  const allFiles = (await utapi.listFiles()).files;
  const unusedFiles = allFiles.filter((file) => !usedFiles.has(file.key));

  if (unusedFiles.length > 0) {
    await utapi.deleteFiles(unusedFiles.map((file) => file.key));
    console.log(`Deleted ${unusedFiles.length} unused files from storage.`);
  } else {
    console.log('No orphan files to delete found');
  }
};

export default cleanOrphanFiles;
