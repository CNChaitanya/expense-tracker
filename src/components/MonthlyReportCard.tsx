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
  
  if (percentage <= 70) { grade = 'A+'; message = 'Crushing it! 🚀'; color = 'text-emerald-500'; }
  else if (percentage <= 80) { grade = 'A'; message = 'Excellent! 🌟'; color = 'text-emerald-400'; }
  else if (percentage <= 90) { grade = 'B'; message = 'Looking good! 👍'; color = 'text-blue-500'; }
  else if (percentage <= 100) { grade = 'C'; message = 'Almost there! 💪'; color = 'text-yellow-500'; }
  else if (percentage <= 110) { grade = 'D'; message = 'Uh oh! 🔥'; color = 'text-orange-500'; }
  else { grade = 'F'; message = 'Emergency! 🚨'; color = 'text-red-500'; }

  return (
    <div className="glass p-6 rounded-[32px] flex items-center justify-between border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <h2 className="text-xl font-black uppercase tracking-tight mb-1">Financial Grade</h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{message}</p>
      </div>
      <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center text-4xl font-black shadow-2xl bg-[#030712]/40 backdrop-blur-xl border border-white/10 ${color} animate-in zoom-in duration-700 relative z-10`}>
        {grade}
      </div>
    </div>
  );
};
