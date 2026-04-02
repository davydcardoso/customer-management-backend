export const calculateYearsBetween = (date: Date | null | undefined): number | null => {
  if (!date) {
    return null;
  }

  const now = new Date();
  let years = now.getUTCFullYear() - date.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - date.getUTCMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < date.getUTCDate())) {
    years -= 1;
  }

  return years >= 0 ? years : 0;
};
