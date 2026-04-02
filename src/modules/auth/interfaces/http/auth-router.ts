import { Router } from 'express';

import { AppDataSource } from '../../../../main/config/data-source';
import { authMiddleware } from '../../../../main/http/middlewares/auth-middleware';
import { validateRequest } from '../../../../main/http/middlewares/validate-request';
import { getCurrentUser } from '../../application/use-cases/get-current-user';
import { loginUser } from '../../application/use-cases/login-user';
import { refreshSession } from '../../application/use-cases/refresh-session';
import { loginSchema, refreshSessionSchema } from './auth-schemas';

export const authRouter = Router();

authRouter.post('/login', validateRequest(loginSchema), async (request, response) => {
  const result = await loginUser(AppDataSource, request.body);
  response.status(200).json(result);
});

authRouter.post('/refresh', validateRequest(refreshSessionSchema), async (request, response) => {
  const result = await refreshSession(AppDataSource, request.body);
  response.status(200).json(result);
});

authRouter.get('/me', authMiddleware, async (request, response) => {
  const result = await getCurrentUser(AppDataSource, request.user!.userId);
  response.status(200).json(result);
});
