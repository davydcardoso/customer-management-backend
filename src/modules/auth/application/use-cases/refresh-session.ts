import crypto from 'node:crypto';

import { DataSource } from 'typeorm';

import { AppError } from '../../../../shared/domain/app-error';
import { RefreshTokenOrmEntity } from '../../infrastructure/orm/entities/refresh-token.orm-entity';
import { TypeOrmRefreshTokenRepository } from '../../infrastructure/repositories/typeorm-refresh-token-repository';
import { TypeOrmUserRepository } from '../../infrastructure/repositories/typeorm-user-repository';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../infrastructure/services/jwt-token-service';

type RefreshSessionInput = {
  refreshToken: string;
};

export const refreshSession = async (dataSource: DataSource, input: RefreshSessionInput) => {
  const refreshTokenRepository = new TypeOrmRefreshTokenRepository(dataSource);
  const userRepository = new TypeOrmUserRepository(dataSource);

  const payload = verifyRefreshToken(input.refreshToken);
  const tokenHash = crypto.createHash('sha256').update(input.refreshToken).digest('hex');
  const persistedToken = await refreshTokenRepository.findActiveByHash(tokenHash);

  if (!persistedToken || persistedToken.userId !== payload.sub || persistedToken.expiresAt < new Date()) {
    throw new AppError('Refresh token is invalid.', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await userRepository.findById(payload.sub);

  if (!user || !user.active) {
    throw new AppError('User not found or inactive.', 401, 'UNAUTHORIZED');
  }

  await refreshTokenRepository.revoke(persistedToken.id);

  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username,
  });
  const refreshToken = signRefreshToken({
    sub: user.id,
    username: user.username,
  });

  const newTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const refreshTokenEntity = new RefreshTokenOrmEntity();
  refreshTokenEntity.userId = user.id;
  refreshTokenEntity.tokenHash = newTokenHash;
  refreshTokenEntity.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  refreshTokenEntity.revokedAt = null;

  await refreshTokenRepository.create(refreshTokenEntity);

  return {
    accessToken,
    refreshToken,
  };
};
