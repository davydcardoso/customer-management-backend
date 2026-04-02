import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrmEntity } from './customer.orm-entity';

@Entity({ name: 'customer_individual_profiles' })
export class CustomerIndividualProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id', type: 'uuid', unique: true })
  customerId!: string;

  @OneToOne(() => CustomerOrmEntity, (customer) => customer.individualProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerOrmEntity;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rg!: string | null;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname!: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gender!: string | null;

  @Column({ name: 'family_relationship', type: 'varchar', length: 100, nullable: true })
  familyRelationship!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profession!: string | null;

  @Column({ name: 'driver_license_expires_at', type: 'date', nullable: true })
  driverLicenseExpiresAt!: string | null;
}
