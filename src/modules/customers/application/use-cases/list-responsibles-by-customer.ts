import { DataSource } from 'typeorm';

import {
  TypeOrmCustomerRepository,
  mapResponsibleResponsePayload,
} from '../../infrastructure/repositories/typeorm-customer-repository';

export const listResponsiblesByCustomer = async (dataSource: DataSource, customerId: string) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  const responsibles = await repository.listResponsibles(customerId);
  return responsibles.map(mapResponsibleResponsePayload);
};
