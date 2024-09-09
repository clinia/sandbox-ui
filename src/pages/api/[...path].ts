import { withApiAuthRequired } from '@/lib/auth';
import { logger } from '@/logger';
import httpProxy from 'http-proxy';
import type { NextApiRequest, NextApiResponse } from 'next';

const proxyServer = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

// We are currently using this proxy to avoid CORS issues with the API.
// We are using api routes from the page directory as it is easier to have a catch all route and using a reverse proxy.
async function proxy(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    if (req.url) {
      req.url = req.url.replace('/api', '');
    }

    // We need to add basic auth
    req.headers.authorization = `Basic ${Buffer.from(`${process.env.ATLAS_ROOT_USER}:${process.env.ATLAS_ROOT_PASSWORD}`).toString('base64')}`;

    proxyServer.web(
      req,
      res,
      {
        target: process.env.API_URL ?? 'http://localhost:3000', // Atlas
      },
      (err: Error | null | undefined) => {
        if (err) {
          logger.error(err, 'Error proxying request');
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
}

export default withApiAuthRequired(proxy);
