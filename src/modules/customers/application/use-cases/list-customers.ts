import { DataSource } from 'typeorm';

import { TypeOrmCustomerRepository, mapCustomerResponse } from '../../infrastructure/repositories/typeorm-customer-repository';

export const listCustomers = async (dataSource: DataSource, page: number, limit: number) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  const result = await repository.list(page, limit);

  return {
    ...result,
    items: result.items.map(mapCustomerResponse),
  };
};
