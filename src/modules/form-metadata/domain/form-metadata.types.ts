import type { PersonType } from '../../customers/domain/customer-enums';

export type ImportanceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type InputType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'date'
  | 'document'
  | 'currency'
  | 'number'
  | 'boolean'
  | 'collection';

export type FieldDataType = 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';

export type SectionConfig = {
  key: string;
  label: string;
  description: string;
  order: number;
};

export type VisibleWhen = {
  personType?: PersonType[];
} | null;

export type FieldConfig = {
  fieldKey: string;
  label: string;
  section: string;
  required: boolean;
  importance: ImportanceLevel;
  inputType: InputType;
  dataType: FieldDataType;
  multiple: boolean;
  computed: boolean;
  readOnly: boolean;
  order: number;
  visibleWhen: VisibleWhen;
  description: string;
  businessImpact: string;
  placeholder?: string | null;
  mask?: string | null;
  optionsSource?: string | null;
};

export type FormConfiguration = {
  formKey: string;
  entity: string;
  version: string;
  sections: SectionConfig[];
  fields: FieldConfig[];
};
