import { DataSource } from 'typeorm';

import { RefreshTokenOrmEntity } from '../../modules/auth/infrastructure/orm/entities/refresh-token.orm-entity';
import { UserOrmEntity } from '../../modules/auth/infrastructure/orm/entities/user.orm-entity';
import { CustomerAddressOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-address.orm-entity';
import { CustomerCommunicationPreferenceOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-communication-preference.orm-entity';
import { CustomerCompanyProfileOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-company-profile.orm-entity';
import { CustomerContactOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-contact.orm-entity';
import { CustomerEmailOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-email.orm-entity';
import { CustomerFinancialProfileOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-financial-profile.orm-entity';
import { CustomerIndividualProfileOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer-individual-profile.orm-entity';
import { CustomerOrmEntity } from '../../modules/customers/infrastructure/orm/entities/customer.orm-entity';
import { ResponsibleAddressOrmEntity } from '../../modules/customers/infrastructure/orm/entities/responsible-address.orm-entity';
import { ResponsibleContactOrmEntity } from '../../modules/customers/infrastructure/orm/entities/responsible-contact.orm-entity';
import { ResponsibleEmailOrmEntity } from '../../modules/customers/infrastructure/orm/entities/responsible-email.orm-entity';
import { ResponsibleOrmEntity } from '../../modules/customers/infrastructure/orm/entities/responsible.orm-entity';
import { FormFieldConfigOrmEntity } from '../../modules/form-metadata/infrastructure/orm/entities/form-field-config.orm-entity';
import { FormSectionConfigOrmEntity } from '../../modules/form-metadata/infrastructure/orm/entities/form-section-config.orm-entity';
import { InitialSchema1743580000000 } from '../../database/migrations/1743580000000-initial-schema';
import { FormMetadataSchema1743581000000 } from '../../database/migrations/1743581000000-form-metadata-schema';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [
    UserOrmEntity,
    RefreshTokenOrmEntity,
    CustomerOrmEntity,
    CustomerIndividualProfileOrmEntity,
    CustomerCompanyProfileOrmEntity,
    CustomerFinancialProfileOrmEntity,
    CustomerAddressOrmEntity,
    CustomerContactOrmEntity,
    CustomerEmailOrmEntity,
    CustomerCommunicationPreferenceOrmEntity,
    ResponsibleOrmEntity,
    ResponsibleAddressOrmEntity,
    ResponsibleContactOrmEntity,
    ResponsibleEmailOrmEntity,
    FormSectionConfigOrmEntity,
    FormFieldConfigOrmEntity,
  ],
  migrations: [InitialSchema1743580000000, FormMetadataSchema1743581000000],
  synchronize: false,
  logging: env.NODE_ENV === 'development',
});
