import crypto from 'node:crypto';

import { DataSource } from 'typeorm';

import { AppError } from '../../../../shared/domain/app-error';
import { RefreshTokenOrmEntity } from '../../infrastructure/orm/entities/refresh-token.orm-entity';
import { TypeOrmRefreshTokenRepository } from '../../infrastructure/repositories/typeorm-refresh-token-repository';
import { TypeOrmUserRepository } from '../../infrastructure/repositories/typeorm-user-repository';
import { signAccessToken, signRefreshToken } from '../../infrastructure/services/jwt-token-service';
import { verifyPassword } from '../../infrastructure/services/password-service';

type LoginUserInput = {
  username: string;
  password: string;
};

export const loginUser = async (dataSource: DataSource, input: LoginUserInput) => {
  const userRepository = new TypeOrmUserRepository(dataSource);
  const refreshTokenRepository = new TypeOrmRefreshTokenRepository(dataSource);

  const user = await userRepository.findByUsername(input.username);

  if (!user || !user.active) {
    throw new AppError('Credenciais inválidas.', 401, 'INVALID_CREDENTIALS');
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Credenciais inválidas.', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    username: user.username,
  });

  const refreshTokenEntity = new RefreshTokenOrmEntity();
  refreshTokenEntity.userId = user.id;
  refreshTokenEntity.tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  refreshTokenEntity.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  refreshTokenEntity.revokedAt = null;

  await refreshTokenRepository.create(refreshTokenEntity);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
    },
  };
};
