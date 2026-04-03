import { Brackets, DataSource } from 'typeorm';

import { AppError } from '../../../../shared/domain/app-error';
import { calculateYearsBetween } from '../../../../shared/utils/date';
import { normalizeDigits } from '../../../../shared/utils/document';
import { normalizeEmail, normalizeNullableText } from '../../../../shared/utils/text';
import type {
  CreateCustomerInput,
  ResponsibleInput,
  UpdateCustomerInput,
  UpdateResponsibleInput,
} from '../../interfaces/http/customer-schemas';
import { CustomerAddressOrmEntity } from '../orm/entities/customer-address.orm-entity';
import { CustomerCommunicationPreferenceOrmEntity } from '../orm/entities/customer-communication-preference.orm-entity';
import { CustomerCompanyProfileOrmEntity } from '../orm/entities/customer-company-profile.orm-entity';
import { CustomerContactOrmEntity } from '../orm/entities/customer-contact.orm-entity';
import { CustomerEmailOrmEntity } from '../orm/entities/customer-email.orm-entity';
import { CustomerFinancialProfileOrmEntity } from '../orm/entities/customer-financial-profile.orm-entity';
import { CustomerIndividualProfileOrmEntity } from '../orm/entities/customer-individual-profile.orm-entity';
import { CustomerOrmEntity } from '../orm/entities/customer.orm-entity';
import { ResponsibleAddressOrmEntity } from '../orm/entities/responsible-address.orm-entity';
import { ResponsibleContactOrmEntity } from '../orm/entities/responsible-contact.orm-entity';
import { ResponsibleEmailOrmEntity } from '../orm/entities/responsible-email.orm-entity';
import { ResponsibleOrmEntity } from '../orm/entities/responsible.orm-entity';

const customerRelations = {
  individualProfile: true,
  companyProfile: true,
  financialProfile: true,
  address: true,
  contacts: true,
  emails: true,
  communicationPreferences: true,
  responsibles: {
    address: true,
    contacts: true,
    emails: true,
  },
} as const;

const toMonetaryString = (value: number | null | undefined): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  return value.toFixed(2);
};

const toNullableNumber = (value: string | null | undefined): number | null => {
  if (value === undefined || value === null) {
    return null;
  }

  return Number(value);
};

const calculateProfitability = (consumedAmount: number | null, costAmount: number | null) => {
  if (consumedAmount === null && costAmount === null) {
    return {
      profitabilityAmount: null,
      profitabilityPercentage: null,
    };
  }

  const safeConsumedAmount = consumedAmount ?? 0;
  const safeCostAmount = costAmount ?? 0;
  const profitabilityAmount = safeConsumedAmount - safeCostAmount;
  const profitabilityPercentage =
    safeConsumedAmount === 0 ? 0 : Number(((profitabilityAmount / safeConsumedAmount) * 100).toFixed(2));

  return {
    profitabilityAmount: profitabilityAmount.toFixed(2),
    profitabilityPercentage: profitabilityPercentage.toFixed(2),
  };
};

const applyCustomerCore = (
  customer: CustomerOrmEntity,
  input: CreateCustomerInput | UpdateCustomerInput,
): void => {
  if (input.personType) {
    customer.personType = input.personType;
  }

  if (input.core) {
    customer.active = input.core.active ?? customer.active ?? true;
    customer.customerSince = input.core.customerSince ?? customer.customerSince ?? null;
    customer.classification = input.core.classification ?? customer.classification ?? null;
    customer.referralSource = input.core.referralSource ?? customer.referralSource ?? null;
    customer.referralName = input.core.referralName ?? customer.referralName ?? null;
    customer.allowsInvoice = input.core.allowsInvoice ?? customer.allowsInvoice ?? false;
    customer.hasRestriction = input.core.hasRestriction ?? customer.hasRestriction ?? false;
    customer.isFinalConsumer = input.core.isFinalConsumer ?? customer.isFinalConsumer ?? false;
    customer.isRuralProducer = input.core.isRuralProducer ?? customer.isRuralProducer ?? false;
    customer.notes = input.core.notes ?? customer.notes ?? null;
  }
};

const buildCustomerAddress = (
  customer: CustomerOrmEntity,
  inputAddress: CreateCustomerInput['address'] | UpdateCustomerInput['address'] | undefined,
  existingAddress?: CustomerAddressOrmEntity | null,
): CustomerAddressOrmEntity | null => {
  if (!inputAddress && !existingAddress) {
    return null;
  }

  const address = new CustomerAddressOrmEntity();
  if (existingAddress?.id) {
    address.id = existingAddress.id;
  }

  address.customer = customer;
  address.customerId = customer.id;
  address.zipCode = normalizeDigits(inputAddress?.zipCode) ?? existingAddress?.zipCode ?? null;
  address.street = inputAddress?.street ?? existingAddress?.street ?? null;
  address.number = inputAddress?.number ?? existingAddress?.number ?? null;
  address.complement = inputAddress?.complement ?? existingAddress?.complement ?? null;
  address.district = inputAddress?.district ?? existingAddress?.district ?? null;
  address.city = inputAddress?.city ?? existingAddress?.city ?? null;
  address.state = inputAddress?.state ?? existingAddress?.state ?? null;
  address.cityCode = inputAddress?.cityCode ?? existingAddress?.cityCode ?? null;
  address.stateCode = inputAddress?.stateCode ?? existingAddress?.stateCode ?? null;
  address.reference = inputAddress?.reference ?? existingAddress?.reference ?? null;

  return address;
};

const buildFinancialProfile = (
  customer: CustomerOrmEntity,
  inputFinancial: CreateCustomerInput['financial'] | UpdateCustomerInput['financial'] | undefined,
  existingFinancial?: CustomerFinancialProfileOrmEntity | null,
): CustomerFinancialProfileOrmEntity | null => {
  if (!inputFinancial && !existingFinancial) {
    return null;
  }

  const financialProfile = new CustomerFinancialProfileOrmEntity();
  if (existingFinancial?.id) {
    financialProfile.id = existingFinancial.id;
  }

  const consumedAmount =
    inputFinancial?.consumedAmount ?? toNullableNumber(existingFinancial?.consumedAmount ?? null);
  const costAmount = inputFinancial?.costAmount ?? toNullableNumber(existingFinancial?.costAmount ?? null);
  const profitability = calculateProfitability(consumedAmount ?? null, costAmount ?? null);

  financialProfile.customer = customer;
  financialProfile.customerId = customer.id;
  financialProfile.creditLimit =
    toMonetaryString(inputFinancial?.creditLimit) ?? existingFinancial?.creditLimit ?? null;
  financialProfile.amountSpent =
    toMonetaryString(inputFinancial?.amountSpent) ?? existingFinancial?.amountSpent ?? null;
  financialProfile.balance = toMonetaryString(inputFinancial?.balance) ?? existingFinancial?.balance ?? null;
  financialProfile.consumedAmount = toMonetaryString(consumedAmount) ?? null;
  financialProfile.costAmount = toMonetaryString(costAmount) ?? null;
  financialProfile.profitabilityAmount = profitability.profitabilityAmount;
  financialProfile.profitabilityPercentage = profitability.profitabilityPercentage;
  financialProfile.commissionPercentage =
    inputFinancial?.commissionPercentage !== undefined && inputFinancial?.commissionPercentage !== null
      ? inputFinancial.commissionPercentage.toFixed(2)
      : existingFinancial?.commissionPercentage ?? null;
  financialProfile.paymentDay = inputFinancial?.paymentDay ?? existingFinancial?.paymentDay ?? null;
  financialProfile.pixKeyOrDescription =
    inputFinancial?.pixKeyOrDescription ?? existingFinancial?.pixKeyOrDescription ?? null;

  return financialProfile;
};

const buildCustomerContacts = (
  customer: CustomerOrmEntity,
  contacts: CreateCustomerInput['contacts'] | UpdateCustomerInput['contacts'] | undefined,
  existingContacts?: CustomerContactOrmEntity[],
): CustomerContactOrmEntity[] => {
  if (!contacts) {
    return existingContacts ?? [];
  }

  return contacts.map((contact) => {
    const entity = new CustomerContactOrmEntity();
    entity.customer = customer;
    entity.customerId = customer.id;
    entity.value = normalizeDigits(contact.value) ?? contact.value.trim();
    entity.type = contact.type;
    entity.isWhatsapp = contact.isWhatsapp ?? false;
    entity.label = normalizeNullableText(contact.label);
    return entity;
  });
};

const buildCustomerEmails = (
  customer: CustomerOrmEntity,
  emails: CreateCustomerInput['emails'] | UpdateCustomerInput['emails'] | undefined,
  existingEmails?: CustomerEmailOrmEntity[],
): CustomerEmailOrmEntity[] => {
  if (!emails) {
    return existingEmails ?? [];
  }

  return emails.map((email) => {
    const entity = new CustomerEmailOrmEntity();
    entity.customer = customer;
    entity.customerId = customer.id;
    entity.email = normalizeEmail(email.email);
    entity.label = normalizeNullableText(email.label);
    return entity;
  });
};

const buildCommunicationPreferences = (
  customer: CustomerOrmEntity,
  preferences:
    | CreateCustomerInput['communicationPreferences']
    | UpdateCustomerInput['communicationPreferences']
    | undefined,
  existingPreferences?: CustomerCommunicationPreferenceOrmEntity[],
): CustomerCommunicationPreferenceOrmEntity[] => {
  if (!preferences) {
    return existingPreferences ?? [];
  }

  return preferences.map((preference) => {
    const entity = new CustomerCommunicationPreferenceOrmEntity();
    entity.customer = customer;
    entity.customerId = customer.id;
    entity.channel = preference.channel;
    entity.topic = preference.topic;
    entity.enabled = preference.enabled;
    return entity;
  });
};

const buildIndividualProfile = (
  customer: CustomerOrmEntity,
  profileInput: Extract<CreateCustomerInput, { personType: 'INDIVIDUAL' }>['profile'] | Record<string, unknown>,
  existingProfile?: CustomerIndividualProfileOrmEntity | null,
): CustomerIndividualProfileOrmEntity => {
  const input = profileInput as Extract<CreateCustomerInput, { personType: 'INDIVIDUAL' }>['profile'];
  const profile = new CustomerIndividualProfileOrmEntity();
  if (existingProfile?.id) {
    profile.id = existingProfile.id;
  }

  profile.customer = customer;
  profile.customerId = customer.id;
  profile.cpf = normalizeDigits(input.cpf) ?? existingProfile?.cpf ?? '';
  profile.rg = input.rg ?? existingProfile?.rg ?? null;
  profile.fullName = input.fullName ?? existingProfile?.fullName ?? '';
  profile.nickname = input.nickname ?? existingProfile?.nickname ?? null;
  profile.birthDate = input.birthDate ?? existingProfile?.birthDate ?? null;
  profile.gender = input.gender ?? existingProfile?.gender ?? null;
  profile.familyRelationship = input.familyRelationship ?? existingProfile?.familyRelationship ?? null;
  profile.profession = input.profession ?? existingProfile?.profession ?? null;
  profile.driverLicenseExpiresAt =
    input.driverLicenseExpiresAt ?? existingProfile?.driverLicenseExpiresAt ?? null;

  return profile;
};

const buildCompanyProfile = (
  customer: CustomerOrmEntity,
  profileInput: Extract<CreateCustomerInput, { personType: 'COMPANY' }>['profile'] | Record<string, unknown>,
  existingProfile?: CustomerCompanyProfileOrmEntity | null,
): CustomerCompanyProfileOrmEntity => {
  const input = profileInput as Extract<CreateCustomerInput, { personType: 'COMPANY' }>['profile'];
  const profile = new CustomerCompanyProfileOrmEntity();
  if (existingProfile?.id) {
    profile.id = existingProfile.id;
  }

  profile.customer = customer;
  profile.customerId = customer.id;
  profile.cnpj = normalizeDigits(input.cnpj) ?? existingProfile?.cnpj ?? '';
  profile.stateRegistration = input.stateRegistration ?? existingProfile?.stateRegistration ?? null;
  profile.corporateName = input.corporateName ?? existingProfile?.corporateName ?? '';
  profile.tradeName = input.tradeName ?? existingProfile?.tradeName ?? '';
  profile.municipalRegistration =
    input.municipalRegistration ?? existingProfile?.municipalRegistration ?? null;
  profile.suframaRegistration = input.suframaRegistration ?? existingProfile?.suframaRegistration ?? null;
  profile.taxpayerType = input.taxpayerType ?? existingProfile?.taxpayerType ?? null;
  profile.openingDate = input.openingDate ?? existingProfile?.openingDate ?? null;
  profile.companySegment = input.companySegment ?? existingProfile?.companySegment ?? null;
  profile.issWithheld = input.issWithheld ?? existingProfile?.issWithheld ?? false;

  return profile;
};

const buildResponsibleAddress = (
  responsible: ResponsibleOrmEntity,
  inputAddress: ResponsibleInput['address'] | UpdateResponsibleInput['address'] | undefined,
  existingAddress?: ResponsibleAddressOrmEntity | null,
): ResponsibleAddressOrmEntity | null => {
  if (!inputAddress && !existingAddress) {
    return null;
  }

  const address = new ResponsibleAddressOrmEntity();
  if (existingAddress?.id) {
    address.id = existingAddress.id;
  }

  address.responsible = responsible;
  address.responsibleId = responsible.id;
  address.zipCode = normalizeDigits(inputAddress?.zipCode) ?? existingAddress?.zipCode ?? null;
  address.street = inputAddress?.street ?? existingAddress?.street ?? null;
  address.number = inputAddress?.number ?? existingAddress?.number ?? null;
  address.complement = inputAddress?.complement ?? existingAddress?.complement ?? null;
  address.district = inputAddress?.district ?? existingAddress?.district ?? null;
  address.city = inputAddress?.city ?? existingAddress?.city ?? null;
  address.state = inputAddress?.state ?? existingAddress?.state ?? null;
  address.cityCode = inputAddress?.cityCode ?? existingAddress?.cityCode ?? null;
  address.stateCode = inputAddress?.stateCode ?? existingAddress?.stateCode ?? null;
  address.reference = inputAddress?.reference ?? existingAddress?.reference ?? null;

  return address;
};

const buildResponsibleContacts = (
  responsible: ResponsibleOrmEntity,
  contacts: ResponsibleInput['contacts'] | UpdateResponsibleInput['contacts'] | undefined,
  existingContacts?: ResponsibleContactOrmEntity[],
): ResponsibleContactOrmEntity[] => {
  if (!contacts) {
    return existingContacts ?? [];
  }

  return contacts.map((contact) => {
    const entity = new ResponsibleContactOrmEntity();
    entity.responsible = responsible;
    entity.responsibleId = responsible.id;
    entity.value = normalizeDigits(contact.value) ?? contact.value.trim();
    entity.type = contact.type;
    entity.isWhatsapp = contact.isWhatsapp ?? false;
    entity.label = normalizeNullableText(contact.label);
    return entity;
  });
};

const buildResponsibleEmails = (
  responsible: ResponsibleOrmEntity,
  emails: ResponsibleInput['emails'] | UpdateResponsibleInput['emails'] | undefined,
  existingEmails?: ResponsibleEmailOrmEntity[],
): ResponsibleEmailOrmEntity[] => {
  if (!emails) {
    return existingEmails ?? [];
  }

  return emails.map((email) => {
    const entity = new ResponsibleEmailOrmEntity();
    entity.responsible = responsible;
    entity.responsibleId = responsible.id;
    entity.email = normalizeEmail(email.email);
    entity.label = normalizeNullableText(email.label);
    return entity;
  });
};

const buildResponsible = (
  customer: CustomerOrmEntity,
  input: ResponsibleInput | UpdateResponsibleInput,
  existingResponsible?: ResponsibleOrmEntity | null,
): ResponsibleOrmEntity => {
  const responsible = new ResponsibleOrmEntity();
  if (existingResponsible?.id) {
    responsible.id = existingResponsible.id;
  }

  responsible.customer = customer;
  responsible.customerId = customer.id;
  responsible.fullName = input.fullName ?? existingResponsible?.fullName ?? '';
  responsible.cpf = normalizeDigits(input.cpf) ?? existingResponsible?.cpf ?? null;
  responsible.rg = input.rg ?? existingResponsible?.rg ?? null;
  responsible.nickname = input.nickname ?? existingResponsible?.nickname ?? null;
  responsible.birthDate = input.birthDate ?? existingResponsible?.birthDate ?? null;
  responsible.gender = input.gender ?? existingResponsible?.gender ?? null;
  responsible.familyRelationship =
    input.familyRelationship ?? existingResponsible?.familyRelationship ?? null;
  responsible.role = input.role ?? existingResponsible?.role ?? null;
  responsible.profession = input.profession ?? existingResponsible?.profession ?? null;
  responsible.driverLicenseExpiresAt =
    input.driverLicenseExpiresAt ?? existingResponsible?.driverLicenseExpiresAt ?? null;
  responsible.active = input.active ?? existingResponsible?.active ?? true;
  responsible.customerSince = input.customerSince ?? existingResponsible?.customerSince ?? null;
  responsible.referralSource = input.referralSource ?? existingResponsible?.referralSource ?? null;
  responsible.referralName = input.referralName ?? existingResponsible?.referralName ?? null;
  responsible.notes = input.notes ?? existingResponsible?.notes ?? null;
  responsible.address = buildResponsibleAddress(responsible, input.address, existingResponsible?.address);
  responsible.contacts = buildResponsibleContacts(responsible, input.contacts, existingResponsible?.contacts);
  responsible.emails = buildResponsibleEmails(responsible, input.emails, existingResponsible?.emails);

  return responsible;
};

const mapResponsibleResponse = (responsible: ResponsibleOrmEntity) => ({
  id: responsible.id,
  fullName: responsible.fullName,
  cpf: responsible.cpf,
  rg: responsible.rg,
  nickname: responsible.nickname,
  birthDate: responsible.birthDate,
  gender: responsible.gender,
  familyRelationship: responsible.familyRelationship,
  role: responsible.role,
  profession: responsible.profession,
  driverLicenseExpiresAt: responsible.driverLicenseExpiresAt,
  active: responsible.active,
  customerSince: responsible.customerSince,
  referralSource: responsible.referralSource,
  referralName: responsible.referralName,
  notes: responsible.notes,
  address: responsible.address
    ? {
        zipCode: responsible.address.zipCode,
        street: responsible.address.street,
        number: responsible.address.number,
        complement: responsible.address.complement,
        district: responsible.address.district,
        city: responsible.address.city,
        state: responsible.address.state,
        cityCode: responsible.address.cityCode,
        stateCode: responsible.address.stateCode,
        reference: responsible.address.reference,
      }
    : null,
  contacts: responsible.contacts.map((contact) => ({
    id: contact.id,
    value: contact.value,
    type: contact.type,
    isWhatsapp: contact.isWhatsapp,
    label: contact.label,
  })),
  emails: responsible.emails.map((email) => ({
    id: email.id,
    email: email.email,
    label: email.label,
  })),
  computed: {
    age: calculateYearsBetween(responsible.birthDate ? new Date(responsible.birthDate) : null),
  },
});

export const mapCustomerResponse = (customer: CustomerOrmEntity) => ({
  id: customer.id,
  personType: customer.personType,
  core: {
    active: customer.active,
    customerSince: customer.customerSince,
    classification: customer.classification,
    referralSource: customer.referralSource,
    referralName: customer.referralName,
    allowsInvoice: customer.allowsInvoice,
    hasRestriction: customer.hasRestriction,
    isFinalConsumer: customer.isFinalConsumer,
    isRuralProducer: customer.isRuralProducer,
    notes: customer.notes,
  },
  profile:
    customer.personType === 'INDIVIDUAL'
      ? {
          cpf: customer.individualProfile?.cpf ?? null,
          rg: customer.individualProfile?.rg ?? null,
          fullName: customer.individualProfile?.fullName ?? null,
          nickname: customer.individualProfile?.nickname ?? null,
          birthDate: customer.individualProfile?.birthDate ?? null,
          gender: customer.individualProfile?.gender ?? null,
          familyRelationship: customer.individualProfile?.familyRelationship ?? null,
          profession: customer.individualProfile?.profession ?? null,
          driverLicenseExpiresAt: customer.individualProfile?.driverLicenseExpiresAt ?? null,
        }
      : {
          cnpj: customer.companyProfile?.cnpj ?? null,
          stateRegistration: customer.companyProfile?.stateRegistration ?? null,
          corporateName: customer.companyProfile?.corporateName ?? null,
          tradeName: customer.companyProfile?.tradeName ?? null,
          municipalRegistration: customer.companyProfile?.municipalRegistration ?? null,
          suframaRegistration: customer.companyProfile?.suframaRegistration ?? null,
          taxpayerType: customer.companyProfile?.taxpayerType ?? null,
          openingDate: customer.companyProfile?.openingDate ?? null,
          companySegment: customer.companyProfile?.companySegment ?? null,
          issWithheld: customer.companyProfile?.issWithheld ?? null,
        },
  financial: customer.financialProfile
    ? {
        creditLimit: toNullableNumber(customer.financialProfile.creditLimit),
        amountSpent: toNullableNumber(customer.financialProfile.amountSpent),
        balance: toNullableNumber(customer.financialProfile.balance),
        consumedAmount: toNullableNumber(customer.financialProfile.consumedAmount),
        costAmount: toNullableNumber(customer.financialProfile.costAmount),
        profitabilityAmount: toNullableNumber(customer.financialProfile.profitabilityAmount),
        profitabilityPercentage: toNullableNumber(customer.financialProfile.profitabilityPercentage),
        commissionPercentage: toNullableNumber(customer.financialProfile.commissionPercentage),
        paymentDay: customer.financialProfile.paymentDay,
        pixKeyOrDescription: customer.financialProfile.pixKeyOrDescription,
      }
    : null,
  address: customer.address
    ? {
        zipCode: customer.address.zipCode,
        street: customer.address.street,
        number: customer.address.number,
        complement: customer.address.complement,
        district: customer.address.district,
        city: customer.address.city,
        state: customer.address.state,
        cityCode: customer.address.cityCode,
        stateCode: customer.address.stateCode,
        reference: customer.address.reference,
      }
    : null,
  contacts: customer.contacts.map((contact) => ({
    id: contact.id,
    value: contact.value,
    type: contact.type,
    isWhatsapp: contact.isWhatsapp,
    label: contact.label,
  })),
  emails: customer.emails.map((email) => ({
    id: email.id,
    email: email.email,
    label: email.label,
  })),
  communicationPreferences: customer.communicationPreferences.map((preference) => ({
    id: preference.id,
    channel: preference.channel,
    topic: preference.topic,
    enabled: preference.enabled,
  })),
  responsibles: customer.responsibles.map(mapResponsibleResponse),
  computed: {
    customerAge: calculateYearsBetween(
      customer.individualProfile?.birthDate ? new Date(customer.individualProfile.birthDate) : null,
    ),
    companyAge: calculateYearsBetween(
      customer.companyProfile?.openingDate ? new Date(customer.companyProfile.openingDate) : null,
    ),
    profitabilityAmount: toNullableNumber(customer.financialProfile?.profitabilityAmount),
    profitabilityPercentage: toNullableNumber(customer.financialProfile?.profitabilityPercentage),
  },
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

export class TypeOrmCustomerRepository {
  constructor(private readonly dataSource: DataSource) {}

  private async ensureIndividualCpfIsAvailable(cpf: string, customerId?: string): Promise<void> {
    const normalizedCpf = normalizeDigits(cpf);

    if (!normalizedCpf) {
      return;
    }

    const query = this.dataSource
      .getRepository(CustomerIndividualProfileOrmEntity)
      .createQueryBuilder('profile')
      .where('profile.cpf = :cpf', { cpf: normalizedCpf });

    if (customerId) {
      query.andWhere('profile.customer_id != :customerId', { customerId });
    }

    const existingProfile = await query.getOne();

    if (existingProfile) {
      throw new AppError('CPF já cadastrado.', 409, 'CUSTOMER_CPF_ALREADY_EXISTS', {
        field: 'cpf',
        value: normalizedCpf,
      });
    }
  }

  private async ensureCompanyCnpjIsAvailable(cnpj: string, customerId?: string): Promise<void> {
    const normalizedCnpj = normalizeDigits(cnpj);

    if (!normalizedCnpj) {
      return;
    }

    const query = this.dataSource
      .getRepository(CustomerCompanyProfileOrmEntity)
      .createQueryBuilder('profile')
      .where('profile.cnpj = :cnpj', { cnpj: normalizedCnpj });

    if (customerId) {
      query.andWhere('profile.customer_id != :customerId', { customerId });
    }

    const existingProfile = await query.getOne();

    if (existingProfile) {
      throw new AppError('CNPJ já cadastrado.', 409, 'CUSTOMER_CNPJ_ALREADY_EXISTS', {
        field: 'cnpj',
        value: normalizedCnpj,
      });
    }
  }

  async create(input: CreateCustomerInput): Promise<CustomerOrmEntity> {
    if (input.personType === 'INDIVIDUAL') {
      await this.ensureIndividualCpfIsAvailable(input.profile.cpf);
    } else {
      await this.ensureCompanyCnpjIsAvailable(input.profile.cnpj);
    }

    const customer = new CustomerOrmEntity();
    customer.personType = input.personType;
    customer.active = true;
    customer.allowsInvoice = false;
    customer.hasRestriction = false;
    customer.isFinalConsumer = false;
    customer.isRuralProducer = false;

    applyCustomerCore(customer, input);
    customer.address = buildCustomerAddress(customer, input.address);
    customer.financialProfile = buildFinancialProfile(customer, input.financial);
    customer.contacts = buildCustomerContacts(customer, input.contacts);
    customer.emails = buildCustomerEmails(customer, input.emails);
    customer.communicationPreferences = buildCommunicationPreferences(
      customer,
      input.communicationPreferences,
    );

    if (input.personType === 'INDIVIDUAL') {
      customer.individualProfile = buildIndividualProfile(customer, input.profile);
      customer.companyProfile = null;
      customer.responsibles = [];
    } else {
      customer.companyProfile = buildCompanyProfile(customer, input.profile);
      customer.individualProfile = null;
      customer.responsibles = input.responsibles.map((responsible) => buildResponsible(customer, responsible));
    }

    return this.dataSource.getRepository(CustomerOrmEntity).save(customer);
  }

  async findByIdOrFail(id: string): Promise<CustomerOrmEntity> {
    const customer = await this.dataSource.getRepository(CustomerOrmEntity).findOne({
      where: { id },
      relations: customerRelations,
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404, 'CUSTOMER_NOT_FOUND');
    }

    return customer;
  }

  async update(id: string, input: UpdateCustomerInput): Promise<CustomerOrmEntity> {
    const customer = await this.findByIdOrFail(id);

    if (input.personType && input.personType !== customer.personType) {
      throw new AppError('Não é permitido alterar o tipo de pessoa.', 400, 'INVALID_PERSON_TYPE_CHANGE');
    }

    applyCustomerCore(customer, input);
    customer.address = buildCustomerAddress(customer, input.address, customer.address);
    customer.financialProfile = buildFinancialProfile(customer, input.financial, customer.financialProfile);
    customer.contacts = buildCustomerContacts(customer, input.contacts, customer.contacts);
    customer.emails = buildCustomerEmails(customer, input.emails, customer.emails);
    customer.communicationPreferences = buildCommunicationPreferences(
      customer,
      input.communicationPreferences,
      customer.communicationPreferences,
    );

    if (customer.personType === 'INDIVIDUAL') {
      if (input.responsibles && input.responsibles.length > 0) {
        throw new AppError(
          'Clientes pessoa física não podem ter responsáveis.',
          400,
          'INVALID_RESPONSIBLES_FOR_INDIVIDUAL',
        );
      }

      if (input.profile) {
        if ('cpf' in input.profile && input.profile.cpf) {
          await this.ensureIndividualCpfIsAvailable(input.profile.cpf, customer.id);
        }

        customer.individualProfile = buildIndividualProfile(customer, input.profile, customer.individualProfile);
      }
    } else {
      if (input.profile) {
        if ('cnpj' in input.profile && input.profile.cnpj) {
          await this.ensureCompanyCnpjIsAvailable(input.profile.cnpj, customer.id);
        }

        customer.companyProfile = buildCompanyProfile(customer, input.profile, customer.companyProfile);
      }

      if (input.responsibles) {
        if (input.responsibles.length === 0) {
          throw new AppError('Clientes pessoa jurídica devem ter pelo menos um responsável.', 400, 'RESPONSIBLE_REQUIRED');
        }

        customer.responsibles = input.responsibles.map((responsible) => buildResponsible(customer, responsible));
      }
    }

    return this.dataSource.getRepository(CustomerOrmEntity).save(customer);
  }

  async list(page: number, limit: number) {
    const [items, total] = await this.dataSource.getRepository(CustomerOrmEntity).findAndCount({
      relations: customerRelations,
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async search(query: string, limit: number) {
    const term = `%${query}%`;

    const items = await this.dataSource
      .getRepository(CustomerOrmEntity)
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.individualProfile', 'individualProfile')
      .leftJoinAndSelect('customer.companyProfile', 'companyProfile')
      .where(
        new Brackets((builder) => {
          builder
            .where('individualProfile.full_name ILIKE :term', { term })
            .orWhere('companyProfile.corporate_name ILIKE :term', { term })
            .orWhere('companyProfile.trade_name ILIKE :term', { term })
            .orWhere('individualProfile.cpf ILIKE :document', { document: `%${normalizeDigits(query) ?? query}%` })
            .orWhere('companyProfile.cnpj ILIKE :document', { document: `%${normalizeDigits(query) ?? query}%` });
        }),
      )
      .orderBy('customer.created_at', 'DESC')
      .take(limit)
      .getMany();

    return items.map((customer) => ({
      id: customer.id,
      personType: customer.personType,
      document:
        customer.personType === 'INDIVIDUAL'
          ? customer.individualProfile?.cpf ?? null
          : customer.companyProfile?.cnpj ?? null,
      name:
        customer.personType === 'INDIVIDUAL'
          ? customer.individualProfile?.fullName ?? null
          : customer.companyProfile?.corporateName ?? null,
      tradeName: customer.companyProfile?.tradeName ?? null,
    }));
  }

  async softDelete(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.dataSource.getRepository(CustomerOrmEntity).softDelete(id);
  }

  async addResponsible(customerId: string, input: ResponsibleInput): Promise<ResponsibleOrmEntity> {
    const customer = await this.findByIdOrFail(customerId);

    if (customer.personType !== 'COMPANY') {
      throw new AppError('Apenas clientes pessoa jurídica podem ter responsáveis.', 400, 'RESPONSIBLE_NOT_ALLOWED');
    }

    const responsible = buildResponsible(customer, input);
    return this.dataSource.getRepository(ResponsibleOrmEntity).save(responsible);
  }

  async findResponsibleOrFail(customerId: string, responsibleId: string): Promise<ResponsibleOrmEntity> {
    const responsible = await this.dataSource.getRepository(ResponsibleOrmEntity).findOne({
      where: { id: responsibleId, customerId },
      relations: {
        address: true,
        contacts: true,
        emails: true,
      },
    });

    if (!responsible) {
      throw new AppError('Responsável não encontrado.', 404, 'RESPONSIBLE_NOT_FOUND');
    }

    return responsible;
  }

  async listResponsibles(customerId: string): Promise<ResponsibleOrmEntity[]> {
    await this.findByIdOrFail(customerId);

    return this.dataSource.getRepository(ResponsibleOrmEntity).find({
      where: { customerId },
      relations: {
        address: true,
        contacts: true,
        emails: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateResponsible(
    customerId: string,
    responsibleId: string,
    input: UpdateResponsibleInput,
  ): Promise<ResponsibleOrmEntity> {
    const customer = await this.findByIdOrFail(customerId);
    const existingResponsible = await this.findResponsibleOrFail(customerId, responsibleId);
    const responsible = buildResponsible(customer, input, existingResponsible);
    responsible.id = responsibleId;
    return this.dataSource.getRepository(ResponsibleOrmEntity).save(responsible);
  }

  async removeResponsible(customerId: string, responsibleId: string): Promise<void> {
    const customer = await this.findByIdOrFail(customerId);

    if (customer.personType !== 'COMPANY') {
      throw new AppError('Apenas clientes pessoa jurídica podem ter responsáveis.', 400, 'RESPONSIBLE_NOT_ALLOWED');
    }

    const responsibles = await this.listResponsibles(customerId);

    if (responsibles.length <= 1) {
      throw new AppError(
        'Clientes pessoa jurídica devem manter pelo menos um responsável.',
        400,
        'LAST_RESPONSIBLE_NOT_ALLOWED',
      );
    }

    await this.dataSource.getRepository(ResponsibleOrmEntity).delete({
      id: responsibleId,
      customerId,
    });
  }
}

export const mapResponsibleResponsePayload = mapResponsibleResponse;
