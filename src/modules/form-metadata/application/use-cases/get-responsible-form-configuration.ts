import { DataSource } from 'typeorm';

import { TypeOrmFormMetadataRepository } from '../../infrastructure/repositories/typeorm-form-metadata-repository';

export const getResponsibleFormConfiguration = async (dataSource: DataSource) => {
  const repository = new TypeOrmFormMetadataRepository(dataSource);
  return repository.getResponsibleFormConfiguration();
};
