import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';

import { openApiDocument } from './openapi';

export const documentationRouter = Router();

documentationRouter.get('/openapi.json', (_request, response) => {
  response.status(200).json(openApiDocument);
});

documentationRouter.use('/docs', (_request, response, next) => {
  response.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  );

  next();
});

documentationRouter.use(
  "/docs",
  apiReference({
    theme: "fastify",
    url: "/openapi.json",
  }),
);
