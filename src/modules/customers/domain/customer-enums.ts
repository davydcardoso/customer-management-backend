export const personTypes = ['INDIVIDUAL', 'COMPANY'] as const;
export const contactTypes = ['PHONE', 'MOBILE', 'MESSAGING'] as const;
export const communicationChannels = ['PHONE', 'EMAIL'] as const;
export const communicationTopics = [
  'KM_UPDATE',
  'CHARGING',
  'MAINTENANCE_ALERT',
  'CAMPAIGNS',
  'NPS',
  'INVOICE',
  'NEXT_REVISIONS',
  'SERVICE_ORDER_COMPLETED',
  'BUDGET_APPROVAL',
  'BIRTHDAY',
] as const;

export type PersonType = (typeof personTypes)[number];
export type ContactType = (typeof contactTypes)[number];
export type CommunicationChannel = (typeof communicationChannels)[number];
export type CommunicationTopic = (typeof communicationTopics)[number];
