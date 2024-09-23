import { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from './schemas';
import { getUserByEmail } from './data/user';
import bcrypt from 'bcryptjs';
import { BadCredentialsError, EmailNotVerifiedError, UserNotActiveError } from './lib/auth-error';
import { getUserById } from './data/user';
import { UserRole } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            if (user.role !== UserRole.ADMIN) {
              if (user.emailVerified === null) throw new EmailNotVerifiedError();
              if (!user.active) throw new UserNotActiveError();
            }
            return user;
          }
          throw new BadCredentialsError();
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.role = token.role as UserRole;
        session.user.image = token.image as string;
        session.user.number = token.number as string;
        session.user.address = token.address as string;
        session.user.pack = token.pack as string;
        session.user.active = token.active as boolean;
        session.user.boarded = token.boarded as boolean;
        session.user.paid = token.paid as boolean;
        session.user.rib = token.rib as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.name = existingUser.fullName;
      token.role = existingUser.role;
      token.image = existingUser.image;
      token.number = existingUser.number;
      token.address = existingUser.address;
      token.pack = existingUser.pack;
      token.active = existingUser.active;
      token.boarded = existingUser.boarded;
      token.paid = existingUser.paid;
      token.rib = existingUser.rib;
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60,
  },
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;
