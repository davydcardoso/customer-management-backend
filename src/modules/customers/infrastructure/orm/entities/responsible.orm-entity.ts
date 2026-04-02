import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerOrmEntity } from './customer.orm-entity';
import { ResponsibleAddressOrmEntity } from './responsible-address.orm-entity';
import { ResponsibleContactOrmEntity } from './responsible-contact.orm-entity';
import { ResponsibleEmailOrmEntity } from './responsible-email.orm-entity';

@Entity({ name: 'responsibles' })
export class ResponsibleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.responsibles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerOrmEntity;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  cpf!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rg!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname!: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gender!: string | null;

  @Column({ name: 'family_relationship', type: 'varchar', length: 100, nullable: true })
  familyRelationship!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profession!: string | null;

  @Column({ name: 'driver_license_expires_at', type: 'date', nullable: true })
  driverLicenseExpiresAt!: string | null;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ name: 'customer_since', type: 'date', nullable: true })
  customerSince!: string | null;

  @Column({ name: 'referral_source', type: 'varchar', length: 100, nullable: true })
  referralSource!: string | null;

  @Column({ name: 'referral_name', type: 'varchar', length: 255, nullable: true })
  referralName!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @OneToOne(() => ResponsibleAddressOrmEntity, (address) => address.responsible, {
    cascade: true,
    eager: false,
  })
  address!: ResponsibleAddressOrmEntity | null;

  @OneToMany(() => ResponsibleContactOrmEntity, (contact) => contact.responsible, {
    cascade: true,
    eager: false,
    orphanedRowAction: 'delete',
  })
  contacts!: ResponsibleContactOrmEntity[];

  @OneToMany(() => ResponsibleEmailOrmEntity, (email) => email.responsible, {
    cascade: true,
    eager: false,
    orphanedRowAction: 'delete',
  })
  emails!: ResponsibleEmailOrmEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
