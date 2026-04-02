import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../../../shared/domain/app-error';
import { logger } from '../../../shared/infrastructure/logger';

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation failed.',
      code: 'VALIDATION_ERROR',
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  logger.error({ error }, 'Unhandled application error');

  response.status(500).json({
    message: 'Internal server error.',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
