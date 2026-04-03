import type { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
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
      message: 'Falha na validação.',
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

  if (error instanceof QueryFailedError) {
    const driverError = error.driverError as
      | {
          code?: string;
          constraint?: string;
          detail?: string;
        }
      | undefined;

    if (driverError?.code === '23505') {
      if (driverError.constraint === 'customer_individual_profiles_cpf_key') {
        response.status(409).json({
          message: 'CPF já cadastrado.',
          code: 'CUSTOMER_CPF_ALREADY_EXISTS',
          details: {
            field: 'cpf',
            constraint: driverError.constraint,
          },
        });
        return;
      }

      if (driverError.constraint === 'customer_company_profiles_cnpj_key') {
        response.status(409).json({
          message: 'CNPJ já cadastrado.',
          code: 'CUSTOMER_CNPJ_ALREADY_EXISTS',
          details: {
            field: 'cnpj',
            constraint: driverError.constraint,
          },
        });
        return;
      }

      response.status(409).json({
        message: 'Registro duplicado.',
        code: 'DUPLICATE_RECORD',
        details: {
          constraint: driverError.constraint,
          detail: driverError.detail,
        },
      });
      return;
    }
  }

  logger.error({ error }, 'Unhandled application error');

  response.status(500).json({
    message: 'Erro interno do servidor.',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
