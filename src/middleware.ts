import { withMiddlewareAuthRequired } from '@/lib/auth/edge';
import createMiddleware from 'next-intl/middleware';
import { NextFetchEvent, NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'never',
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // We skip the next-intl middleware for the auth page as it is not translated
  // and the locale parameter is conflicting with the auth0 route handlers.
  // As the auth0 route handlers are not translated, we can safely skip it.
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

  if (isAuthPage) {
    return withMiddlewareAuthRequired()(req, event);
  }
  return withMiddlewareAuthRequired(intlMiddleware)(req, event);
}

export const config = {
  matcher: ['/((?!api|_next|livez|healthz|_vercel|.*\\..*).*)'],
};
