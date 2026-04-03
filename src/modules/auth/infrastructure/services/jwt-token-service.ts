import {
  sign,
  verify,
  type JwtPayload,
  type Secret,
  type SignOptions,
} from 'jsonwebtoken';

import { env } from '../../../../main/config/env';
import { AppError } from '../../../../shared/domain/app-error';
import type { AuthTokenPayload } from '../../domain/auth-token-payload';

const buildSignOptions = (subject: string, expiresIn: string): SignOptions => ({
  subject,
  expiresIn: expiresIn as SignOptions['expiresIn'],
});

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

export const signAccessToken = (payload: Omit<AuthTokenPayload, 'type'>): string =>
  sign(
    { username: payload.username, type: 'access' },
    accessSecret,
    buildSignOptions(payload.sub, env.JWT_ACCESS_EXPIRES_IN),
  );

export const signRefreshToken = (payload: Omit<AuthTokenPayload, 'type'>): string =>
  sign(
    { username: payload.username, type: 'refresh' },
    refreshSecret,
    buildSignOptions(payload.sub, env.JWT_REFRESH_EXPIRES_IN),
  );

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  try {
    const decoded = verify(token, accessSecret) as JwtPayload;

    if (decoded.type !== 'access' || typeof decoded.sub !== 'string' || typeof decoded.username !== 'string') {
      throw new Error('Invalid token payload');
    }

    return {
      sub: decoded.sub,
      username: decoded.username,
      type: 'access',
    };
  } catch {
    throw new AppError('Token de acesso inválido ou expirado.', 401, 'UNAUTHORIZED');
  }
};

export const verifyRefreshToken = (token: string): AuthTokenPayload => {
  try {
    const decoded = verify(token, refreshSecret) as JwtPayload;

    if (decoded.type !== 'refresh' || typeof decoded.sub !== 'string' || typeof decoded.username !== 'string') {
      throw new Error('Invalid token payload');
    }

    return {
      sub: decoded.sub,
      username: decoded.username,
      type: 'refresh',
    };
  } catch {
    throw new AppError('Token de atualização inválido ou expirado.', 401, 'UNAUTHORIZED');
  }
};
