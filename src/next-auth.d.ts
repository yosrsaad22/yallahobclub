import { UserRole } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  image: string;
  number: string;
  address: string;
  state: string;
  city: string;
  pack: packOptions;
  active: boolean;
  boarded: number;
  paid: boolean;
  code: string;
  rib: string;
  balance: number;
  storeName: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
