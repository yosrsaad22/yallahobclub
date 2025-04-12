import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import {
  ADMIN_LOGIN_REDIRECT,
  USER_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
} from './routes';
import { UserRole } from '@prisma/client';

const { auth } = NextAuth(authConfig);

const authMiddleware = auth(async (req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth?.user;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const role = auth?.user?.role;

  // 🔁 Prevent redirect loop
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(role === 'ADMIN' ? ADMIN_LOGIN_REDIRECT : USER_LOGIN_REDIRECT, nextUrl)
    );
  }

  // 🔐 Block access to private pages if not logged in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // 🔄 Role-based redirection
  if (!isAuthRoute && !isPublicRoute && isLoggedIn) {
    if (role === 'ADMIN' && !nextUrl.pathname.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
    }
    if (role === 'USER' && !nextUrl.pathname.startsWith('/dashboard/user')) {
      return NextResponse.redirect(new URL(USER_LOGIN_REDIRECT, nextUrl));
    }
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = new RegExp(
    `^(${publicRoutes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return NextResponse.next();
  }

  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
