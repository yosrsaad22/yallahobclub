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
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        // ✅ Cas spécial : admin hardcodé
        if (
          email === "yosrsaad367@gmail.com" &&
          password === "yallahobclub2025"
        ) {
          const user = await getUserByEmail(email);

          if (user) {
            if (user.role !== UserRole.ADMIN) {
              user.role = UserRole.ADMIN;
              // Optionnel : tu peux mettre à jour la BDD ici
              await db.User.update({
                where: { id: user.id },
                data: { role: UserRole.ADMIN },
              });
            }
            return user;
          }

          // Admin fallback si pas trouvé en BDD
          return {
            id: "admin-fallback",
            name: "Admin",
            email,
            role: UserRole.ADMIN,
          };
        }

        // ✅ Utilisateur classique
        const user = await getUserByEmail(email);
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new BadCredentialsError();

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      token.role = user.role;
      token.image = user.image;
      token.number = user.number;
      token.address = user.address;
      token.fullName = user.fullName;
      token.onBoarding = user.onBoarding;

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
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
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h
  },

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
