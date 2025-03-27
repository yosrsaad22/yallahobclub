import { NextRequest, NextResponse } from 'next/server';
import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import { ADMIN_LOGIN_REDIRECT, USER_LOGIN_REDIRECT, authRoutes, publicRoutes } from './routes';
import { UserRole } from '@prisma/client';

const { auth } = NextAuth(authConfig);

const authMiddleware = auth(async (req: any) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const role = auth?.user?.role;

  if (!isAuthRoute && !isPublicRoute && isLoggedIn) {
    switch (role) {
      case UserRole.ADMIN:
        if (!nextUrl.pathname.startsWith('/dashboard/admin')) {
          return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
        }
        break;
      case UserRole.USER:
        if (!nextUrl.pathname.startsWith('/dashboard/user')) {
          return NextResponse.redirect(new URL(USER_LOGIN_REDIRECT, nextUrl));
        }
        break;
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      switch (role) {
        case UserRole.ADMIN:
          return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
        case UserRole.USER:
          return NextResponse.redirect(new URL(USER_LOGIN_REDIRECT, nextUrl));
      }
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = new RegExp(
    `^(${publicRoutes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i',
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return NextResponse.next();
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
