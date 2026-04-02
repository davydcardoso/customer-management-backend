import { DataSource } from 'typeorm';

import { TypeOrmCustomerRepository } from '../../infrastructure/repositories/typeorm-customer-repository';

export const removeResponsible = async (
  dataSource: DataSource,
  customerId: string,
  responsibleId: string,
) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  await repository.removeResponsible(customerId, responsibleId);
};
