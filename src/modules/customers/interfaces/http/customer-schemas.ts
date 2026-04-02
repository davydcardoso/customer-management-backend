import { z } from 'zod';

import {
  communicationChannels,
  communicationTopics,
  contactTypes,
  personTypes,
} from '../../domain/customer-enums';

const nullableTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

const booleanWithDefault = z.boolean().optional();
const dateString = z.string().date().optional().nullable();

const coreSchema = z.object({
  active: booleanWithDefault,
  customerSince: dateString,
  classification: nullableTrimmedString,
  referralSource: nullableTrimmedString,
  referralName: nullableTrimmedString,
  allowsInvoice: booleanWithDefault,
  hasRestriction: booleanWithDefault,
  isFinalConsumer: booleanWithDefault,
  isRuralProducer: booleanWithDefault,
  notes: nullableTrimmedString,
});

const financialSchema = z.object({
  creditLimit: z.coerce.number().nonnegative().optional().nullable(),
  amountSpent: z.coerce.number().nonnegative().optional().nullable(),
  balance: z.coerce.number().nonnegative().optional().nullable(),
  consumedAmount: z.coerce.number().nonnegative().optional().nullable(),
  costAmount: z.coerce.number().nonnegative().optional().nullable(),
  commissionPercentage: z.coerce.number().nonnegative().optional().nullable(),
  paymentDay: z.coerce.number().int().min(1).max(31).optional().nullable(),
  pixKeyOrDescription: nullableTrimmedString,
});

const addressSchema = z.object({
  zipCode: nullableTrimmedString,
  street: nullableTrimmedString,
  number: nullableTrimmedString,
  complement: nullableTrimmedString,
  district: nullableTrimmedString,
  city: nullableTrimmedString,
  state: nullableTrimmedString,
  cityCode: nullableTrimmedString,
  stateCode: nullableTrimmedString,
  reference: nullableTrimmedString,
});

const contactSchema = z.object({
  value: z.string().trim().min(1),
  type: z.enum(contactTypes),
  isWhatsapp: z.boolean().optional().default(false),
  label: nullableTrimmedString,
});

const emailSchema = z.object({
  email: z.email(),
  label: nullableTrimmedString,
});

const communicationPreferenceSchema = z.object({
  channel: z.enum(communicationChannels),
  topic: z.enum(communicationTopics),
  enabled: z.boolean(),
});

const responsibleSchema = z.object({
  fullName: z.string().trim().min(1),
  cpf: nullableTrimmedString,
  rg: nullableTrimmedString,
  nickname: nullableTrimmedString,
  birthDate: dateString,
  gender: nullableTrimmedString,
  familyRelationship: nullableTrimmedString,
  role: nullableTrimmedString,
  profession: nullableTrimmedString,
  driverLicenseExpiresAt: dateString,
  active: booleanWithDefault,
  customerSince: dateString,
  referralSource: nullableTrimmedString,
  referralName: nullableTrimmedString,
  notes: nullableTrimmedString,
  address: addressSchema.optional(),
  contacts: z.array(contactSchema).optional().default([]),
  emails: z.array(emailSchema).optional().default([]),
});

export const createResponsibleSchema = responsibleSchema;

const individualProfileSchema = z.object({
  cpf: z.string().trim().min(1),
  rg: nullableTrimmedString,
  fullName: z.string().trim().min(1),
  nickname: nullableTrimmedString,
  birthDate: dateString,
  gender: nullableTrimmedString,
  familyRelationship: nullableTrimmedString,
  profession: nullableTrimmedString,
  driverLicenseExpiresAt: dateString,
});

const companyProfileSchema = z.object({
  cnpj: z.string().trim().min(1),
  stateRegistration: nullableTrimmedString,
  corporateName: z.string().trim().min(1),
  tradeName: z.string().trim().min(1),
  municipalRegistration: nullableTrimmedString,
  suframaRegistration: nullableTrimmedString,
  taxpayerType: nullableTrimmedString,
  openingDate: dateString,
  companySegment: nullableTrimmedString,
  issWithheld: booleanWithDefault,
});

export const createCustomerSchema = z.discriminatedUnion('personType', [
  z.object({
    personType: z.literal(personTypes[0]),
    core: coreSchema.optional().default({}),
    profile: individualProfileSchema,
    financial: financialSchema.optional().default({}),
    address: addressSchema.optional().default({}),
    contacts: z.array(contactSchema).optional().default([]),
    emails: z.array(emailSchema).optional().default([]),
    communicationPreferences: z.array(communicationPreferenceSchema).optional().default([]),
    responsibles: z.array(responsibleSchema).max(0).optional().default([]),
  }),
  z.object({
    personType: z.literal(personTypes[1]),
    core: coreSchema.optional().default({}),
    profile: companyProfileSchema,
    financial: financialSchema.optional().default({}),
    address: addressSchema.optional().default({}),
    contacts: z.array(contactSchema).optional().default([]),
    emails: z.array(emailSchema).optional().default([]),
    communicationPreferences: z.array(communicationPreferenceSchema).optional().default([]),
    responsibles: z.array(responsibleSchema).min(1),
  }),
]);

export const updateCustomerSchema = z.object({
  personType: z.enum(personTypes).optional(),
  core: coreSchema.partial().optional(),
  profile: z.union([individualProfileSchema.partial(), companyProfileSchema.partial()]).optional(),
  financial: financialSchema.partial().optional(),
  address: addressSchema.partial().optional(),
  contacts: z.array(contactSchema).optional(),
  emails: z.array(emailSchema).optional(),
  communicationPreferences: z.array(communicationPreferenceSchema).optional(),
  responsibles: z.array(responsibleSchema).optional(),
});

export const updateResponsibleSchema = responsibleSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ResponsibleInput = z.infer<typeof responsibleSchema>;
export type UpdateResponsibleInput = z.infer<typeof updateResponsibleSchema>;
