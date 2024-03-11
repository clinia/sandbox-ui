// eslint-disable-next-line import/no-named-as-default -- This is a false positive
import pino from 'pino';

/*
 * A logger instance that can be used in the server.
 * WARNING: Do not use this logger in the browser, as it will expose sensitive information.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});
