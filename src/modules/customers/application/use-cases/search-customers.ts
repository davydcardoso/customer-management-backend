import { DataSource } from 'typeorm';

import { TypeOrmCustomerRepository } from '../../infrastructure/repositories/typeorm-customer-repository';

export const searchCustomers = async (dataSource: DataSource, query: string, limit: number) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  return repository.search(query, limit);
};
