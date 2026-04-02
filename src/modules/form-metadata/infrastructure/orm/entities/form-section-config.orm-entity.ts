import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'form_section_configs' })
@Unique('uq_form_section_configs_form_key_section_key', ['formKey', 'sectionKey'])
export class FormSectionConfigOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'form_key', type: 'varchar', length: 100 })
  formKey!: string;

  @Column({ type: 'varchar', length: 100 })
  entity!: string;

  @Column({ type: 'varchar', length: 20 })
  version!: string;

  @Column({ name: 'section_key', type: 'varchar', length: 100 })
  sectionKey!: string;

  @Column({ type: 'varchar', length: 150 })
  label!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'display_order', type: 'integer' })
  displayOrder!: number;
}
