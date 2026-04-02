import { DataSource } from 'typeorm';

import type { CreateCustomerInput } from '../../interfaces/http/customer-schemas';
import { TypeOrmCustomerRepository, mapCustomerResponse } from '../../infrastructure/repositories/typeorm-customer-repository';

export const createCustomer = async (dataSource: DataSource, input: CreateCustomerInput) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  const customer = await repository.create(input);
  const hydrated = await repository.findByIdOrFail(customer.id);
  return mapCustomerResponse(hydrated);
};
