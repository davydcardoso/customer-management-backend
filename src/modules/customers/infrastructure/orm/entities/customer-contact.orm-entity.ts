import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrmEntity } from './customer.orm-entity';

@Entity({ name: 'customer_contacts' })
export class CustomerContactOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerOrmEntity;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ type: 'varchar', length: 50 })
  value!: string;

  @Column({ type: 'varchar', length: 30 })
  type!: string;

  @Column({ name: 'is_whatsapp', type: 'boolean', default: false })
  isWhatsapp!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  label!: string | null;
}
