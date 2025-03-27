import { UserRole } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  image: string;
  number: string;
  fullName: string;
  address: string;
  onBoarding: number;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
