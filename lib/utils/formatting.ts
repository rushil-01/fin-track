// Format date to DD/MM/YYYY
export const formatDateDMY = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format currency with Indian numbering system (₹)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Parse DD/MM/YYYY string to Date
export const parseDateDMY = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Get month and year from date
export const getMonthYear = (date: Date | string): { month: number; year: number } => {
  const d = new Date(date);
  return { month: d.getMonth() + 1, year: d.getFullYear() };
};

// Format month for display (e.g., "January 2024")
export const formatMonthYear = (month: number, year: number): string => {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};
