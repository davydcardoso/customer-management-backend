import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ResponsibleOrmEntity } from './responsible.orm-entity';

@Entity({ name: 'responsible_contacts' })
export class ResponsibleContactOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ResponsibleOrmEntity, (responsible) => responsible.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responsible_id' })
  responsible!: ResponsibleOrmEntity;

  @Column({ name: 'responsible_id', type: 'uuid' })
  responsibleId!: string;

  @Column({ type: 'varchar', length: 50 })
  value!: string;

  @Column({ type: 'varchar', length: 30 })
  type!: string;

  @Column({ name: 'is_whatsapp', type: 'boolean', default: false })
  isWhatsapp!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  label!: string | null;
}
