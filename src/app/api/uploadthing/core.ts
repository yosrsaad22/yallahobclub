import { auth } from '@/auth';
import { getUserById } from '@/data/user';
import { UnauthorizedError } from '@/lib/auth-error';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UTApi } from 'uploadthing/server';

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const id = session.user.id;
  return { id };
};

const handleRole = async (userRole: UserRole[]) => {
  const session = await auth();
  if (session?.user.role !== userRole[0] && session?.user.role !== userRole[1]) throw new UnauthorizedError();
  const id = session.user.id;
  return { id };
};

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.id) {
        try {
          const existingUser = await getUserById(metadata.id);
          if (!existingUser) {
            return { error: 'email-not-found-error' };
          }
          const utapi = new UTApi();

          if (existingUser.image) {
            await utapi.deleteFiles(existingUser.image);
          }
          await db.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              image: file.key,
            },
          });
        } catch (error) {
          return { error: 'image-upload-error' };
        }
      }
    }),

  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleRole([UserRole.ADMIN]))
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.id) {
        try {
          const course = await db.course.findFirst();

          const utapi = new UTApi();

          if (course?.image) {
            await utapi.deleteFiles(course.image);
          }
          await db.course.updateMany({
            where: {},
            data: {
              image: file.key,
            },
          });
        } catch (error) {
          return { error: 'image-upload-error' };
        }
      }
    }),

  chapterVideo: f({ video: { maxFileSize: '1GB', maxFileCount: 1 } })
    .middleware(() => handleRole([UserRole.ADMIN]))
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.id) {
        return { key: file.key };
      }
    }),

  productMedia: f({ video: { maxFileSize: '1GB', maxFileCount: 2 }, image: { maxFileSize: '4MB', maxFileCount: 5 } })
    .middleware(() => handleRole([UserRole.SUPPLIER, UserRole.ADMIN]))
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.id) {
        try {
        } catch (error) {
          return { error: 'media-upload-error' };
        }
      }
    }),

  CIN1: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.id) {
        try {
        } catch (error) {
          return { error: 'image-upload-error' };
        }
      }
    }),
  CIN2: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.id) {
        try {
        } catch (error) {
          return { error: 'image-upload-error' };
        }
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
