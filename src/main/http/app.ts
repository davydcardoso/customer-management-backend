import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { logger } from '../../shared/infrastructure/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/error-handler';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: '*',
  }));
  app.use(express.json());
  app.use(
    pinoHttp({
      logger,
    }),
  );

  registerRoutes(app);
  app.use(errorHandler);

  return app;
};
