import { initAuth0 } from '@auth0/nextjs-auth0/edge';
import type { NextMiddleware } from 'next/server';
import { NextResponse } from 'next/server';
import { authConfig, authEnabled } from './config';

const auth = initAuth0(authConfig);

const withMiddlewareAuthRequired = (middleware?: NextMiddleware) => {
  if (!authEnabled()) {
    return middleware || (() => NextResponse.next());
  }

  return auth.withMiddlewareAuthRequired(middleware);
};

export { withMiddlewareAuthRequired };
