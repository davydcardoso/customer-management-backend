import { DataSource } from 'typeorm';

import { TypeOrmCustomerRepository, mapCustomerResponse } from '../../infrastructure/repositories/typeorm-customer-repository';

export const getCustomerById = async (dataSource: DataSource, customerId: string) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  const customer = await repository.findByIdOrFail(customerId);
  return mapCustomerResponse(customer);
};
