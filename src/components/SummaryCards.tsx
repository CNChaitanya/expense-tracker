import React from 'react';
import { formatCurrency } from '../lib/currency';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface SummaryCardsProps {
  spent: number;
  income: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ spent, income }) => {
  const balance = income - spent;
  
  const animatedSpent = useAnimatedNumber(spent);
  const animatedIncome = useAnimatedNumber(income);
  const animatedBalance = useAnimatedNumber(balance);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-red-500 shadow-lg shadow-red-500/10">
        <span className="text-sm text-gray-500 font-medium">Total Spent</span>
        <span className="text-2xl font-bold text-red-500 tracking-tight">₹{formatCurrency(animatedSpent)}</span>
      </div>
      <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-green-500 shadow-lg shadow-green-500/10">
        <span className="text-sm text-gray-500 font-medium">Total Income</span>
        <span className="text-2xl font-bold text-green-500 tracking-tight">₹{formatCurrency(animatedIncome)}</span>
      </div>
      <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-accent shadow-lg shadow-accent/10">
        <span className="text-sm text-gray-500 font-medium">Net Balance</span>
        <span className="text-2xl font-bold text-accent tracking-tight">₹{formatCurrency(animatedBalance)}</span>
      </div>
    </div>
  );
};
