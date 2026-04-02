import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ResponsibleOrmEntity } from './responsible.orm-entity';

@Entity({ name: 'responsible_emails' })
export class ResponsibleEmailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ResponsibleOrmEntity, (responsible) => responsible.emails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responsible_id' })
  responsible!: ResponsibleOrmEntity;

  @Column({ name: 'responsible_id', type: 'uuid' })
  responsibleId!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  label!: string | null;
}
