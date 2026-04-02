import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerAddressOrmEntity } from './customer-address.orm-entity';
import { CustomerCommunicationPreferenceOrmEntity } from './customer-communication-preference.orm-entity';
import { CustomerCompanyProfileOrmEntity } from './customer-company-profile.orm-entity';
import { CustomerContactOrmEntity } from './customer-contact.orm-entity';
import { CustomerEmailOrmEntity } from './customer-email.orm-entity';
import { CustomerFinancialProfileOrmEntity } from './customer-financial-profile.orm-entity';
import { CustomerIndividualProfileOrmEntity } from './customer-individual-profile.orm-entity';
import { ResponsibleOrmEntity } from './responsible.orm-entity';

@Entity({ name: 'customers' })
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'person_type', type: 'varchar', length: 20 })
  personType!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ name: 'customer_since', type: 'date', nullable: true })
  customerSince!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  classification!: string | null;

  @Column({ name: 'referral_source', type: 'varchar', length: 100, nullable: true })
  referralSource!: string | null;

  @Column({ name: 'referral_name', type: 'varchar', length: 255, nullable: true })
  referralName!: string | null;

  @Column({ name: 'allows_invoice', type: 'boolean', default: false })
  allowsInvoice!: boolean;

  @Column({ name: 'has_restriction', type: 'boolean', default: false })
  hasRestriction!: boolean;

  @Column({ name: 'is_final_consumer', type: 'boolean', default: false })
  isFinalConsumer!: boolean;

  @Column({ name: 'is_rural_producer', type: 'boolean', default: false })
  isRuralProducer!: boolean;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @OneToOne(() => CustomerIndividualProfileOrmEntity, (profile) => profile.customer, {
    cascade: true,
    eager: false,
  })
  individualProfile!: CustomerIndividualProfileOrmEntity | null;

  @OneToOne(() => CustomerCompanyProfileOrmEntity, (profile) => profile.customer, {
    cascade: true,
    eager: false,
  })
  companyProfile!: CustomerCompanyProfileOrmEntity | null;

  @OneToOne(() => CustomerFinancialProfileOrmEntity, (profile) => profile.customer, {
    cascade: true,
    eager: false,
  })
  financialProfile!: CustomerFinancialProfileOrmEntity | null;

  @OneToOne(() => CustomerAddressOrmEntity, (address) => address.customer, {
    cascade: true,
    eager: false,
  })
  address!: CustomerAddressOrmEntity | null;

  @OneToMany(() => CustomerContactOrmEntity, (contact) => contact.customer, {
    cascade: true,
    eager: false,
    orphanedRowAction: 'delete',
  })
  contacts!: CustomerContactOrmEntity[];

  @OneToMany(() => CustomerEmailOrmEntity, (email) => email.customer, {
    cascade: true,
    eager: false,
    orphanedRowAction: 'delete',
  })
  emails!: CustomerEmailOrmEntity[];

  @OneToMany(
    () => CustomerCommunicationPreferenceOrmEntity,
    (preference) => preference.customer,
    {
      cascade: true,
      eager: false,
      orphanedRowAction: 'delete',
    },
  )
  communicationPreferences!: CustomerCommunicationPreferenceOrmEntity[];

  @OneToMany(() => ResponsibleOrmEntity, (responsible) => responsible.customer, {
    cascade: true,
    eager: false,
    orphanedRowAction: 'delete',
  })
  responsibles!: ResponsibleOrmEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
