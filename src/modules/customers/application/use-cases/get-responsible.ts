import { DataSource } from 'typeorm';

import {
  TypeOrmCustomerRepository,
  mapResponsibleResponsePayload,
} from '../../infrastructure/repositories/typeorm-customer-repository';

export const getResponsible = async (dataSource: DataSource, customerId: string, responsibleId: string) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  const responsible = await repository.findResponsibleOrFail(customerId, responsibleId);
  return mapResponsibleResponsePayload(responsible);
};
