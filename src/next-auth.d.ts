import { UserRole } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  image: string;
  number: string;
  address: string;
  pack: packOptions;
  active: boolean;
  boarded: boolean;
  paid: boolean;
  rib: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
