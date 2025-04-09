import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { LoginSchema } from "./schemas";
import { getUserByEmail, getUserById } from "./data/user";
import bcrypt from "bcryptjs";
import { BadCredentialsError } from "./lib/auth-error";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

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
            return user;
          }
          throw new BadCredentialsError();
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.image = token.image as string;
        session.user.number = token.number as string;
        session.user.address = token.address as string;
        session.user.fullName = token.fullName as string;
        session.user.onBoarding = token.onBoarding as number;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.image = existingUser.image;
      token.number = existingUser.number;
      token.address = existingUser.address;
      token.fullName = existingUser.fullName;
      token.onBoarding = existingUser.onBoarding;

      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;
