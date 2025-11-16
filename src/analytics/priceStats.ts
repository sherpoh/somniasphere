export const calculateDelta = (current: number, previous: number): number => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

export const movingAverage = (data: number[], windowSize = 5): number | null => {
  if (data.length < windowSize) return null;
  const slice = data.slice(-windowSize);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return sum / windowSize;
};