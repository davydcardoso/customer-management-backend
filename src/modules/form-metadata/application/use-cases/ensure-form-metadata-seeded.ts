import { DataSource } from 'typeorm';

import { TypeOrmFormMetadataRepository } from '../../infrastructure/repositories/typeorm-form-metadata-repository';

export const ensureFormMetadataSeeded = async (dataSource: DataSource): Promise<void> => {
  const repository = new TypeOrmFormMetadataRepository(dataSource);
  await repository.ensureDefaultsSeeded();
};
