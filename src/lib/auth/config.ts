import type { ConfigParameters } from '@auth0/nextjs-auth0';

export const authConfig: ConfigParameters = {
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  issuerBaseURL: process.env.AUTH_ISSUER_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    response_mode: 'query',
    scope: 'openid offline',
  },
  session: {
    name: 'clinia_sandbox_session',
  },
  idpLogout: true,
  auth0Logout: true,
  routes: {
    callback: '/auth/callback',
    login: '/auth/login',
    postLogoutRedirect: process.env.AUTH_POST_LOGOUT_REDIRECT_URI,
  },
};

export const authEnabled = () => bool(process.env.AUTH_ENABLE, true);

const FALSEY = ['n', 'no', 'false', '0', 'off'];

const bool = (param?: unknown, defaultValue?: boolean): boolean => {
  if (param === undefined || param === '') return defaultValue ?? false;
  if (param && typeof param === 'string')
    return !FALSEY.includes(param.toLowerCase().trim());
  return Boolean(param);
};
