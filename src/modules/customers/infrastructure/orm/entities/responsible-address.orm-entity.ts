import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ResponsibleOrmEntity } from './responsible.orm-entity';

@Entity({ name: 'responsible_addresses' })
export class ResponsibleAddressOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'responsible_id', type: 'uuid', unique: true })
  responsibleId!: string;

  @OneToOne(() => ResponsibleOrmEntity, (responsible) => responsible.address, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responsible_id' })
  responsible!: ResponsibleOrmEntity;

  @Column({ name: 'zip_code', type: 'varchar', length: 20, nullable: true })
  zipCode!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  number!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complement!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state!: string | null;

  @Column({ name: 'city_code', type: 'varchar', length: 50, nullable: true })
  cityCode!: string | null;

  @Column({ name: 'state_code', type: 'varchar', length: 50, nullable: true })
  stateCode!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference!: string | null;
}
