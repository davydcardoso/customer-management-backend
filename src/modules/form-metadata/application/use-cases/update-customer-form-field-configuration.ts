import { DataSource } from 'typeorm';

import type { FieldConfig } from '../../domain/form-metadata.types';
import { TypeOrmFormMetadataRepository } from '../../infrastructure/repositories/typeorm-form-metadata-repository';

export const updateCustomerFormFieldConfiguration = async (
  dataSource: DataSource,
  fieldKey: string,
  input: Partial<Omit<FieldConfig, 'fieldKey'>>,
) => {
  const repository = new TypeOrmFormMetadataRepository(dataSource);
  await repository.updateCustomerField(fieldKey, input);
  return repository.getCustomerFormConfiguration();
};
