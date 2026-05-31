import Decimal from 'decimal.js';

export const formatCurrency = (amountInCents: number): string => {
  return new Decimal(amountInCents).div(100).toFixed(2);
};

export const parseCurrency = (amountStr: string): number => {
  try {
    return new Decimal(amountStr).mul(100).toNumber();
  } catch {
    return 0;
  }
};

export const calculatePercentage = (spent: number, budget: number): number => {
  if (budget === 0) return 0;
  return new Decimal(spent).div(budget).mul(100).toNumber();
};
