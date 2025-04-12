import { auth } from '@/auth';
import { getUserById } from '@/data/user';
import { UnauthorizedError } from '@/lib/auth-error';
import { db } from '@/lib/db';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UTApi } from 'uploadthing/server';

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
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
            return { error: 'Utilisateur non trouvé' };
          }
          const utapi = new UTApi();

          if (existingUser.image) {
            await utapi.deleteFiles(existingUser.image);
          }
          await db.User.update({
            where: {
              id: existingUser.id,
            },
            data: {
              image: file.key,
            },
          });
        } catch (error) {
          return { error: "Erreur lors de la mise à jour de l'image de l'utilisateur" };
        }
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
