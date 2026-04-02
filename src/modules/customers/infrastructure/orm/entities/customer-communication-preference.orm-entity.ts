import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrmEntity } from './customer.orm-entity';

@Entity({ name: 'customer_communication_preferences' })
export class CustomerCommunicationPreferenceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerOrmEntity, (customer) => customer.communicationPreferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerOrmEntity;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ type: 'varchar', length: 30 })
  channel!: string;

  @Column({ type: 'varchar', length: 50 })
  topic!: string;

  @Column({ type: 'boolean', default: true })
  enabled!: boolean;
}
