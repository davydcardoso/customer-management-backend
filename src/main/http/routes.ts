import type { Express } from 'express';

import { authRouter } from '../../modules/auth/interfaces/http/auth-router';
import { customerRouter } from '../../modules/customers/interfaces/http/customer-router';
import { formMetadataRouter } from '../../modules/form-metadata/interfaces/http/form-metadata-router';
import { documentationRouter } from './docs/documentation-router';

export const registerRoutes = (app: Express): void => {
  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use(documentationRouter);
  app.use('/auth', authRouter);
  app.use('/customers', customerRouter);
  app.use('/form-metadata', formMetadataRouter);
};
