import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency, calculatePercentage } from '../lib/currency';

export const BudgetMonitor: React.FC = () => {
  const { expenses } = useExpenses();
  const { categories } = useBudgets();

  const budgetStats = categories
    .filter(cat => cat.budgetAmount > 0)
    .map(cat => {
      const spent = expenses
        .filter(e => e.categoryId === cat.id && e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
      
      const percentage = calculatePercentage(spent, cat.budgetAmount);
      
      return {
        ...cat,
        spent,
        percentage
      };
    });

  if (budgetStats.length === 0) return null;

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl space-y-6">
      <h2 className="text-xl font-bold">Budgets</h2>
      <div className="space-y-6">
        {budgetStats.map(stat => (
          <div key={stat.id} className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="font-bold">{stat.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ₹{formatCurrency(stat.spent)} of ₹{formatCurrency(stat.budgetAmount)}
                </span>
              </div>
              <span className={`text-sm font-bold ${stat.percentage >= 80 ? 'text-red-500' : 'text-accent'}`}>
                {Math.round(stat.percentage)}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${stat.percentage >= 100 ? 'bg-red-600' : stat.percentage >= 80 ? 'bg-red-400' : 'bg-accent'}`}
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>
            {stat.percentage >= 80 && (
              <p className="text-[10px] text-red-500 font-medium">
                {stat.percentage >= 100 ? 'Budget Exceeded!' : 'Approaching budget limit (80%+)'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
