import { DataSource } from 'typeorm';

import { env } from '../../../../main/config/env';
import { logger } from '../../../../shared/infrastructure/logger';
import { UserOrmEntity } from '../../infrastructure/orm/entities/user.orm-entity';
import { hashPassword } from '../../infrastructure/services/password-service';

export const ensureAdminUserSeeded = async (dataSource: DataSource): Promise<void> => {
  const repository = dataSource.getRepository(UserOrmEntity);
  const existingUser = await repository.findOne({
    where: { username: env.ADMIN_USERNAME },
  });

  if (existingUser) {
    return;
  }

  const user = repository.create({
    username: env.ADMIN_USERNAME,
    passwordHash: await hashPassword(env.ADMIN_PASSWORD),
    active: true,
  });

  await repository.save(user);
  logger.info(`Default admin user seeded: ${env.ADMIN_USERNAME}`);
};
