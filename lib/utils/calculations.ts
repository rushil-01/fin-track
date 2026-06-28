// Calculate simple interest
export const calculateSimpleInterest = (
  principal: number,
  rate: number,
  tenure: number // in years
): { interest: number; total: number } => {
  const interest = (principal * rate * tenure) / 100;
  const total = principal + interest;
  return { interest, total };
};

// Calculate compound interest
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  tenure: number, // in years
  frequency: number = 12 // compounding frequency per year (12 for monthly)
): { interest: number; total: number } => {
  const rateDecimal = rate / 100;
  const total = principal * Math.pow(1 + rateDecimal / frequency, frequency * tenure);
  const interest = total - principal;
  return { interest, total };
};

// Filter data by month and year
export const filterByMonth = (
  items: Array<{ date: string | Date }>,
  month: number,
  year: number
): Array<{ date: string | Date }> => {
  return items.filter((item) => {
    const d = new Date(item.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
};

// Sum amounts from array
export const sumAmounts = (items: Array<{ amount: number }>): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};
