import type { GetSession } from '@auth0/nextjs-auth0';
import { Session, initAuth0 } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { authConfig, authEnabled } from './config';

const auth = initAuth0(authConfig);

const getSession: GetSession = async (...args) => {
  if (!authEnabled()) {
    return new Session({
      sub: 'stub-user-id',
    });
  }

  return auth.getSession(...args);
};

const handleAuth = (): ((req: Request) => Response) => {
  if (!authEnabled()) {
    return (req: Request) => Response.redirect(new URL('/', req.url));
  }

  return auth.handleAuth() as (req: Request) => Response;
};

const withApiAuthRequired = (handler: NextApiHandler) => {
  if (!authEnabled()) {
    return handler;
  }

  return auth.withApiAuthRequired(handler);
};

export { getSession, handleAuth, withApiAuthRequired };
