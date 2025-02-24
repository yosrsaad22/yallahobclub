import createIntlMiddleware from 'next-intl/middleware';
import { localePrefix, locales } from '@/navigation';
import { NextRequest, NextResponse } from 'next/server';
import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import {
  ADMIN_LOGIN_REDIRECT,
  SELLER_LOGIN_REDIRECT,
  SUPPLIER_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
} from './routes';
import { UserRole } from '@prisma/client';

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'fr',
});

const { auth } = NextAuth(authConfig);

function stripLocalePrefix(pathname: string, locales: readonly string[]): string {
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  return pathname.replace(localePattern, '');
}

const authMiddleware = auth(async (req: any) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!req.auth;
  const normalizedPathname = stripLocalePrefix(nextUrl.pathname, locales);
  const isPublicRoute = publicRoutes.includes(normalizedPathname);
  const isAuthRoute = authRoutes.includes(normalizedPathname);
  const isMarketplaceRoute = req.nextUrl.pathname.includes('/dashboard/marketplace');
  const isNotificationsRoute = req.nextUrl.pathname.includes('/dashboard/notifications');

  const role = auth?.user?.role;

  // Prevent suppliers from accessing marketplace
  if (isMarketplaceRoute && role === UserRole.SUPPLIER) {
    return NextResponse.redirect(new URL(SUPPLIER_LOGIN_REDIRECT, nextUrl));
  }

  if (!isAuthRoute && !isPublicRoute && !isMarketplaceRoute && !isNotificationsRoute && isLoggedIn) {
    switch (role) {
      case UserRole.ADMIN:
        if (!normalizedPathname.startsWith('/dashboard/admin')) {
          return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
        }
        break;
      case UserRole.SELLER:
        if (!normalizedPathname.startsWith('/dashboard/seller')) {
          return NextResponse.redirect(new URL(SELLER_LOGIN_REDIRECT, nextUrl));
        }
        break;
      case UserRole.SUPPLIER:
        if (!normalizedPathname.startsWith('/dashboard/supplier')) {
          return NextResponse.redirect(new URL(SUPPLIER_LOGIN_REDIRECT, nextUrl));
        }
        break;
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      switch (role) {
        case UserRole.ADMIN:
          return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
        case UserRole.SELLER:
          return NextResponse.redirect(new URL(SELLER_LOGIN_REDIRECT, nextUrl));
        case UserRole.SUPPLIER:
          return NextResponse.redirect(new URL(SUPPLIER_LOGIN_REDIRECT, nextUrl));
      }
    }
    return intlMiddleware(req);
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return intlMiddleware(req);
});

function isAllowedLocalePathname(pathname: string, locale: string) {
  const normalizedPathname = stripLocalePrefix(pathname, locales);
  const isPublicRoute = publicRoutes.includes(normalizedPathname);
  const isAuthRoute = authRoutes.includes(normalizedPathname);
  if (locale === 'tn' && !isAuthRoute && !isPublicRoute) {
    return false;
  }
  return true;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const locale = pathname.split('/')[1];

  const publicPathnameRegex = new RegExp(
    `^(/(${locales.join('|')}))?(${publicRoutes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i',
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else if (!isAllowedLocalePathname(pathname, locale)) {
    const defaultLocale = 'fr';
    const url = new URL(req.nextUrl.href);
    url.pathname = `/${defaultLocale}${stripLocalePrefix(pathname, locales)}`;
    return NextResponse.redirect(url);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
