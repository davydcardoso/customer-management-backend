import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'form_field_configs' })
@Unique('uq_form_field_configs_form_key_field_key', ['formKey', 'fieldKey'])
export class FormFieldConfigOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'form_key', type: 'varchar', length: 100 })
  formKey!: string;

  @Column({ type: 'varchar', length: 100 })
  entity!: string;

  @Column({ type: 'varchar', length: 20 })
  version!: string;

  @Column({ name: 'field_key', type: 'varchar', length: 150 })
  fieldKey!: string;

  @Column({ type: 'varchar', length: 100 })
  section!: string;

  @Column({ type: 'varchar', length: 150 })
  label!: string;

  @Column({ type: 'boolean' })
  required!: boolean;

  @Column({ type: 'varchar', length: 20 })
  importance!: string;

  @Column({ name: 'input_type', type: 'varchar', length: 30 })
  inputType!: string;

  @Column({ name: 'data_type', type: 'varchar', length: 20 })
  dataType!: string;

  @Column({ type: 'boolean' })
  multiple!: boolean;

  @Column({ type: 'boolean' })
  computed!: boolean;

  @Column({ name: 'read_only', type: 'boolean' })
  readOnly!: boolean;

  @Column({ name: 'display_order', type: 'integer' })
  displayOrder!: number;

  @Column({ name: 'visible_when', type: 'jsonb', nullable: true })
  visibleWhen!: Record<string, unknown> | null;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'business_impact', type: 'text' })
  businessImpact!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeholder!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mask!: string | null;

  @Column({ name: 'options_source', type: 'varchar', length: 100, nullable: true })
  optionsSource!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
