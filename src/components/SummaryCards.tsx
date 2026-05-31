import React from 'react';
import { formatCurrency } from '../lib/currency';

interface SummaryCardsProps {
  spent: number;
  income: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ spent, income }) => {
  const balance = income - spent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-red-500 shadow-lg shadow-red-500/10">
        <span className="text-sm text-gray-500 font-medium">Total Spent</span>
        <span className="text-2xl font-bold text-red-500">${formatCurrency(spent)}</span>
      </div>
      <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-green-500 shadow-lg shadow-green-500/10">
        <span className="text-sm text-gray-500 font-medium">Total Income</span>
        <span className="text-2xl font-bold text-green-500">${formatCurrency(income)}</span>
      </div>
      <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-accent shadow-lg shadow-accent/10">
        <span className="text-sm text-gray-500 font-medium">Net Balance</span>
        <span className="text-2xl font-bold text-accent">${formatCurrency(balance)}</span>
      </div>
    </div>
  );
};
