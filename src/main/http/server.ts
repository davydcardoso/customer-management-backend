import { createApp } from './app';
import { AppDataSource } from '../config/data-source';
import { env } from '../config/env';
import { logger } from '../../shared/infrastructure/logger';
import { ensureAdminUserSeeded } from '../../modules/auth/application/use-cases/ensure-admin-user-seeded';
import { ensureFormMetadataSeeded } from '../../modules/form-metadata/application/use-cases/ensure-form-metadata-seeded';

const bootstrap = async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await ensureAdminUserSeeded(AppDataSource);
  await ensureFormMetadataSeeded(AppDataSource);

  const app = createApp();

  app.listen(env.PORT, env.APP_HOST, () => {
    logger.info(`HTTP server running on ${env.APP_HOST}:${env.PORT}`);
  });
};

bootstrap().catch((error: unknown) => {
  logger.error({ error }, 'Application bootstrap failed');
  process.exit(1);
});
