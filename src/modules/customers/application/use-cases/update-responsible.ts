import { DataSource } from 'typeorm';

import type { UpdateResponsibleInput } from '../../interfaces/http/customer-schemas';
import {
  TypeOrmCustomerRepository,
  mapResponsibleResponsePayload,
} from '../../infrastructure/repositories/typeorm-customer-repository';

export const updateResponsible = async (
  dataSource: DataSource,
  customerId: string,
  responsibleId: string,
  input: UpdateResponsibleInput,
) => {
  const repository = new TypeOrmCustomerRepository(dataSource);
  await repository.updateResponsible(customerId, responsibleId, input);
  const responsible = await repository.findResponsibleOrFail(customerId, responsibleId);
  return mapResponsibleResponsePayload(responsible);
};
