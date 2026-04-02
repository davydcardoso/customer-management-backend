export const normalizeDigits = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\D/g, '');
  return normalized.length > 0 ? normalized : null;
};
