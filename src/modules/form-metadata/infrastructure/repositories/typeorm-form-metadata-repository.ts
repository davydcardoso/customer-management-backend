import { DataSource } from 'typeorm';

import { AppError } from '../../../../shared/domain/app-error';
import {
  customerFormMetadataDefaults,
  filterFieldsByPersonType,
  groupFieldsBySections,
  responsibleFormMetadataDefaults,
} from '../../application/form-metadata';
import type { FieldConfig, FormConfiguration, SectionConfig } from '../../domain/form-metadata.types';
import { FormFieldConfigOrmEntity } from '../orm/entities/form-field-config.orm-entity';
import { FormSectionConfigOrmEntity } from '../orm/entities/form-section-config.orm-entity';

const CUSTOMER_FORM_KEY = customerFormMetadataDefaults.formKey;
const RESPONSIBLE_FORM_KEY = responsibleFormMetadataDefaults.formKey;

const mapSection = (section: FormSectionConfigOrmEntity): SectionConfig => ({
  key: section.sectionKey,
  label: section.label,
  description: section.description,
  order: section.displayOrder,
});

const mapField = (field: FormFieldConfigOrmEntity): FieldConfig => ({
  fieldKey: field.fieldKey,
  label: field.label,
  section: field.section,
  required: field.required,
  importance: field.importance as FieldConfig['importance'],
  inputType: field.inputType as FieldConfig['inputType'],
  dataType: field.dataType as FieldConfig['dataType'],
  multiple: field.multiple,
  computed: field.computed,
  readOnly: field.readOnly,
  order: field.displayOrder,
  visibleWhen: (field.visibleWhen as FieldConfig['visibleWhen']) ?? null,
  description: field.description,
  businessImpact: field.businessImpact,
  placeholder: field.placeholder,
  mask: field.mask,
  optionsSource: field.optionsSource,
});

export class TypeOrmFormMetadataRepository {
  constructor(private readonly dataSource: DataSource) {}

  async ensureDefaultsSeeded(): Promise<void> {
    const sectionRepository = this.dataSource.getRepository(FormSectionConfigOrmEntity);
    const fieldRepository = this.dataSource.getRepository(FormFieldConfigOrmEntity);

    const existingCustomerFields = await fieldRepository.count({
      where: { formKey: CUSTOMER_FORM_KEY },
    });

    if (existingCustomerFields === 0) {
      await sectionRepository.save(
        customerFormMetadataDefaults.sections.map((section) =>
          sectionRepository.create({
            formKey: customerFormMetadataDefaults.formKey,
            entity: customerFormMetadataDefaults.entity,
            version: customerFormMetadataDefaults.version,
            sectionKey: section.key,
            label: section.label,
            description: section.description,
            displayOrder: section.order,
          }),
        ),
      );

      await fieldRepository.save(
        customerFormMetadataDefaults.fields.map((field) =>
          fieldRepository.create({
            formKey: customerFormMetadataDefaults.formKey,
            entity: customerFormMetadataDefaults.entity,
            version: customerFormMetadataDefaults.version,
            fieldKey: field.fieldKey,
            section: field.section,
            label: field.label,
            required: field.required,
            importance: field.importance,
            inputType: field.inputType,
            dataType: field.dataType,
            multiple: field.multiple,
            computed: field.computed,
            readOnly: field.readOnly,
            displayOrder: field.order,
            visibleWhen: field.visibleWhen,
            description: field.description,
            businessImpact: field.businessImpact,
            placeholder: field.placeholder ?? null,
            mask: field.mask ?? null,
            optionsSource: field.optionsSource ?? null,
          }),
        ),
      );
    }

    const existingResponsibleFields = await fieldRepository.count({
      where: { formKey: RESPONSIBLE_FORM_KEY },
    });

    if (existingResponsibleFields === 0) {
      await sectionRepository.save(
        responsibleFormMetadataDefaults.sections.map((section) =>
          sectionRepository.create({
            formKey: responsibleFormMetadataDefaults.formKey,
            entity: responsibleFormMetadataDefaults.entity,
            version: responsibleFormMetadataDefaults.version,
            sectionKey: section.key,
            label: section.label,
            description: section.description,
            displayOrder: section.order,
          }),
        ),
      );

      await fieldRepository.save(
        responsibleFormMetadataDefaults.fields.map((field) =>
          fieldRepository.create({
            formKey: responsibleFormMetadataDefaults.formKey,
            entity: responsibleFormMetadataDefaults.entity,
            version: responsibleFormMetadataDefaults.version,
            fieldKey: field.fieldKey,
            section: field.section,
            label: field.label,
            required: field.required,
            importance: field.importance,
            inputType: field.inputType,
            dataType: field.dataType,
            multiple: field.multiple,
            computed: field.computed,
            readOnly: field.readOnly,
            displayOrder: field.order,
            visibleWhen: field.visibleWhen,
            description: field.description,
            businessImpact: field.businessImpact,
            placeholder: field.placeholder ?? null,
            mask: field.mask ?? null,
            optionsSource: field.optionsSource ?? null,
          }),
        ),
      );
    }
  }

  async getCustomerFormConfiguration(personType?: 'INDIVIDUAL' | 'COMPANY') {
    const [sectionEntities, fieldEntities] = await Promise.all([
      this.dataSource.getRepository(FormSectionConfigOrmEntity).find({
        where: { formKey: CUSTOMER_FORM_KEY },
        order: { displayOrder: 'ASC' },
      }),
      this.dataSource.getRepository(FormFieldConfigOrmEntity).find({
        where: { formKey: CUSTOMER_FORM_KEY },
        order: { displayOrder: 'ASC' },
      }),
    ]);

    const sections = sectionEntities.map(mapSection);
    const fields = filterFieldsByPersonType(fieldEntities.map(mapField), personType);

    return {
      formKey: customerFormMetadataDefaults.formKey,
      entity: customerFormMetadataDefaults.entity,
      version: customerFormMetadataDefaults.version,
      scope: {
        personType: personType ?? null,
      },
      sections: sections.filter((section) => fields.some((field) => field.section === section.key)),
      fields,
      groupedFields: groupFieldsBySections(sections, fields),
    };
  }

  async getResponsibleFormConfiguration() {
    const [sectionEntities, fieldEntities] = await Promise.all([
      this.dataSource.getRepository(FormSectionConfigOrmEntity).find({
        where: { formKey: RESPONSIBLE_FORM_KEY },
        order: { displayOrder: 'ASC' },
      }),
      this.dataSource.getRepository(FormFieldConfigOrmEntity).find({
        where: { formKey: RESPONSIBLE_FORM_KEY },
        order: { displayOrder: 'ASC' },
      }),
    ]);

    const sections = sectionEntities.map(mapSection);
    const fields = fieldEntities.map(mapField);

    return {
      formKey: responsibleFormMetadataDefaults.formKey,
      entity: responsibleFormMetadataDefaults.entity,
      version: responsibleFormMetadataDefaults.version,
      sections,
      fields,
      groupedFields: groupFieldsBySections(sections, fields),
    };
  }

  async updateCustomerField(
    fieldKey: string,
    input: Partial<Omit<FieldConfig, 'fieldKey'>>,
  ): Promise<FormFieldConfigOrmEntity> {
    const repository = this.dataSource.getRepository(FormFieldConfigOrmEntity);
    const field = await repository.findOne({
      where: {
        formKey: CUSTOMER_FORM_KEY,
        fieldKey,
      },
    });

    if (!field) {
      throw new AppError('Form field configuration not found.', 404, 'FORM_FIELD_NOT_FOUND');
    }

    if (input.section) {
      const sectionExists = await this.dataSource.getRepository(FormSectionConfigOrmEntity).findOne({
        where: {
          formKey: CUSTOMER_FORM_KEY,
          sectionKey: input.section,
        },
      });

      if (!sectionExists) {
        throw new AppError('Target section not found for form field.', 400, 'FORM_SECTION_NOT_FOUND');
      }
    }

    field.label = input.label ?? field.label;
    field.section = input.section ?? field.section;
    field.required = input.required ?? field.required;
    field.importance = input.importance ?? field.importance;
    field.inputType = input.inputType ?? field.inputType;
    field.dataType = input.dataType ?? field.dataType;
    field.multiple = input.multiple ?? field.multiple;
    field.computed = input.computed ?? field.computed;
    field.readOnly = input.readOnly ?? field.readOnly;
    field.displayOrder = input.order ?? field.displayOrder;
    field.visibleWhen = input.visibleWhen !== undefined ? (input.visibleWhen as Record<string, unknown> | null) : field.visibleWhen;
    field.description = input.description ?? field.description;
    field.businessImpact = input.businessImpact ?? field.businessImpact;
    field.placeholder = input.placeholder !== undefined ? input.placeholder ?? null : field.placeholder;
    field.mask = input.mask !== undefined ? input.mask ?? null : field.mask;
    field.optionsSource =
      input.optionsSource !== undefined ? input.optionsSource ?? null : field.optionsSource;

    return repository.save(field);
  }
}

export type PersistedFormConfiguration = ReturnType<TypeOrmFormMetadataRepository['getCustomerFormConfiguration']>;
export type PersistedResponsibleFormConfiguration = ReturnType<TypeOrmFormMetadataRepository['getResponsibleFormConfiguration']>;
