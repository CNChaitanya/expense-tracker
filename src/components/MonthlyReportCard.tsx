import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';

export const MonthlyReportCard: React.FC = () => {
  const { expenses } = useExpenses();
  const { categories } = useBudgets();

  const totalBudget = categories.reduce((sum, c) => sum + c.budgetAmount, 0);
  const totalSpent = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);

  if (totalBudget === 0) return null;

  const percentage = (totalSpent / totalBudget) * 100;
  
  let grade = 'F';
  let message = 'Uh oh! 🔥';
  let color = 'text-red-500';
  
  if (percentage <= 70) { grade = 'A+'; message = 'Crushing it! 🚀'; color = 'text-green-500'; }
  else if (percentage <= 80) { grade = 'A'; message = 'Excellent! 🌟'; color = 'text-green-400'; }
  else if (percentage <= 90) { grade = 'B'; message = 'Looking good! 👍'; color = 'text-blue-500'; }
  else if (percentage <= 100) { grade = 'C'; message = 'Almost there! 💪'; color = 'text-yellow-500'; }
  else if (percentage <= 110) { grade = 'D'; message = 'Careful! ⚠️'; color = 'text-orange-500'; }

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold mb-1">Monthly Report Card</h2>
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black shadow-inner bg-gray-50 dark:bg-gray-800 ${color} animate-in zoom-in duration-700`}>
        {grade}
      </div>
    </div>
  );
};
