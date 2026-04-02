import { DataSource } from 'typeorm';

import type { PersonType } from '../../../customers/domain/customer-enums';
import { TypeOrmFormMetadataRepository } from '../../infrastructure/repositories/typeorm-form-metadata-repository';

export const getCustomerFormFieldConfiguration = async (
  dataSource: DataSource,
  personType?: PersonType,
) => {
  const repository = new TypeOrmFormMetadataRepository(dataSource);
  return repository.getCustomerFormConfiguration(personType);
};
