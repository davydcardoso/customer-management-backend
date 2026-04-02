import { Router } from 'express';

import { AppDataSource } from '../../../../main/config/data-source';
import { authMiddleware } from '../../../../main/http/middlewares/auth-middleware';
import { validateRequest } from '../../../../main/http/middlewares/validate-request';
import { getCustomerFormFieldConfiguration } from '../../application/use-cases/get-customer-form-field-configuration';
import { getResponsibleFormConfiguration } from '../../application/use-cases/get-responsible-form-configuration';
import { updateCustomerFormFieldConfiguration } from '../../application/use-cases/update-customer-form-field-configuration';
import {
  customerFormMetadataQuerySchema,
  updateCustomerFormFieldParamsSchema,
  updateCustomerFormFieldSchema,
} from './form-metadata-schemas';

export const formMetadataRouter = Router();

formMetadataRouter.use(authMiddleware);

formMetadataRouter.get('/customers', async (request, response) => {
  const query = customerFormMetadataQuerySchema.parse(request.query);
  const result = await getCustomerFormFieldConfiguration(AppDataSource, query.personType);
  response.status(200).json(result);
});

formMetadataRouter.get('/customers/fields', async (request, response) => {
  const query = customerFormMetadataQuerySchema.parse(request.query);
  const result = await getCustomerFormFieldConfiguration(AppDataSource, query.personType);
  response.status(200).json(result);
});

formMetadataRouter.patch(
  '/customers/fields/:fieldKey',
  validateRequest(updateCustomerFormFieldSchema),
  async (request, response) => {
    const { fieldKey } = updateCustomerFormFieldParamsSchema.parse(request.params);
    const result = await updateCustomerFormFieldConfiguration(AppDataSource, fieldKey, request.body);
    response.status(200).json(result);
  },
);

formMetadataRouter.get('/responsibles', async (_request, response) => {
  const result = await getResponsibleFormConfiguration(AppDataSource);
  response.status(200).json(result);
});
