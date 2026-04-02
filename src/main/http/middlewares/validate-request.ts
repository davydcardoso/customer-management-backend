import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    request.body = schema.parse(request.body);
    next();
  };
