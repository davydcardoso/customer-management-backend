import { DataSource } from 'typeorm';

import type { ResponsibleInput } from '../../interfaces/http/customer-schemas';
import {
  TypeOrmCustomerRepository,
  mapResponsibleResponsePayload,
} from '../../infrastructure/repositories/typeorm-customer-repository';

export const addResponsibleToCustomer = async (
  dataSource: DataSource,
  customerId: string,
  input: ResponsibleInput,
) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  const responsible = await repository.addResponsible(customerId, input);
  const hydrated = await repository.findResponsibleOrFail(customerId, responsible.id);
  return mapResponsibleResponsePayload(hydrated);
};
