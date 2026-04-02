import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrmEntity } from './customer.orm-entity';

@Entity({ name: 'customer_company_profiles' })
export class CustomerCompanyProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id', type: 'uuid', unique: true })
  customerId!: string;

  @OneToOne(() => CustomerOrmEntity, (customer) => customer.companyProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerOrmEntity;

  @Column({ type: 'varchar', length: 18, unique: true })
  cnpj!: string;

  @Column({ name: 'state_registration', type: 'varchar', length: 50, nullable: true })
  stateRegistration!: string | null;

  @Column({ name: 'corporate_name', type: 'varchar', length: 255 })
  corporateName!: string;

  @Column({ name: 'trade_name', type: 'varchar', length: 255 })
  tradeName!: string;

  @Column({ name: 'municipal_registration', type: 'varchar', length: 50, nullable: true })
  municipalRegistration!: string | null;

  @Column({ name: 'suframa_registration', type: 'varchar', length: 50, nullable: true })
  suframaRegistration!: string | null;

  @Column({ name: 'taxpayer_type', type: 'varchar', length: 100, nullable: true })
  taxpayerType!: string | null;

  @Column({ name: 'opening_date', type: 'date', nullable: true })
  openingDate!: string | null;

  @Column({ name: 'company_segment', type: 'varchar', length: 100, nullable: true })
  companySegment!: string | null;

  @Column({ name: 'iss_withheld', type: 'boolean', default: false })
  issWithheld!: boolean;
}
