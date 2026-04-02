import { compare, hash } from 'bcryptjs';

export const hashPassword = async (value: string): Promise<string> => hash(value, 10);

export const verifyPassword = async (value: string, valueHash: string): Promise<boolean> =>
  compare(value, valueHash);
