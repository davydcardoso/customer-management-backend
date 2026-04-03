import { DataSource } from 'typeorm';

import { AppError } from '../../../../shared/domain/app-error';
import { TypeOrmUserRepository } from '../../infrastructure/repositories/typeorm-user-repository';

export const getCurrentUser = async (dataSource: DataSource, userId: string) => {
  const userRepository = new TypeOrmUserRepository(dataSource);
  const user = await userRepository.findById(userId);

  if (!user || !user.active) {
    throw new AppError('Usuário não encontrado.', 404, 'USER_NOT_FOUND');
  }

  return {
    id: user.id,
    username: user.username,
    active: user.active,
  };
};
