import { DataSource } from 'typeorm';

import type { UpdateCustomerInput } from '../../interfaces/http/customer-schemas';
import { TypeOrmCustomerRepository, mapCustomerResponse } from '../../infrastructure/repositories/typeorm-customer-repository';

export const updateCustomer = async (
  dataSource: DataSource,
  customerId: string,
  input: UpdateCustomerInput,
) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  await repository.update(customerId, input);
  const customer = await repository.findByIdOrFail(customerId);
  return mapCustomerResponse(customer);
};
