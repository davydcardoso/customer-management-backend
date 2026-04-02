import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../../../modules/auth/infrastructure/services/jwt-token-service';
import { AppError } from '../../../shared/domain/app-error';

export const authMiddleware = (request: Request, _response: Response, next: NextFunction): void => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    next(new AppError('Authentication token not provided.', 401, 'UNAUTHORIZED'));
    return;
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    next(new AppError('Invalid authentication header.', 401, 'UNAUTHORIZED'));
    return;
  }

  const payload = verifyAccessToken(token);

  request.user = {
    userId: payload.sub,
    username: payload.username,
  };

  next();
};
