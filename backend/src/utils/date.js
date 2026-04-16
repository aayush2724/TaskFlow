export const toDateKey = (value = new Date()) => new Date(value).toISOString().slice(0, 10);

export const daysBetween = (dateA, dateB) => {
  const start = new Date(dateA);
  const end = new Date(dateB);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
};
