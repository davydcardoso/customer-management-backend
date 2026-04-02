import { z } from 'zod';

export const customerFormMetadataQuerySchema = z.object({
  personType: z.enum(['INDIVIDUAL', 'COMPANY']).optional(),
});

export const updateCustomerFormFieldParamsSchema = z.object({
  fieldKey: z.string().min(1),
});

export const updateCustomerFormFieldSchema = z.object({
  label: z.string().trim().min(1).optional(),
  section: z.string().trim().min(1).optional(),
  required: z.boolean().optional(),
  importance: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  inputType: z
    .enum(['text', 'textarea', 'select', 'date', 'document', 'currency', 'number', 'boolean', 'collection'])
    .optional(),
  dataType: z.enum(['string', 'number', 'boolean', 'date', 'object', 'array']).optional(),
  multiple: z.boolean().optional(),
  computed: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  visibleWhen: z
    .object({
      personType: z.array(z.enum(['INDIVIDUAL', 'COMPANY'])).optional(),
    })
    .nullable()
    .optional(),
  description: z.string().trim().min(1).optional(),
  businessImpact: z.string().trim().min(1).optional(),
  placeholder: z.string().trim().nullable().optional(),
  mask: z.string().trim().nullable().optional(),
  optionsSource: z.string().trim().nullable().optional(),
});
