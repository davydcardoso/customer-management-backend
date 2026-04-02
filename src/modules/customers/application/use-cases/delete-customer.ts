import { DataSource } from 'typeorm';

import { TypeOrmCustomerRepository } from '../../infrastructure/repositories/typeorm-customer-repository';

export const deleteCustomer = async (dataSource: DataSource, customerId: string) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  await repository.softDelete(customerId);
};
