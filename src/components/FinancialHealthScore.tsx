import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';
import { useStreaks } from '../hooks/useStreaks';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinancialHealthScore: React.FC = () => {
  const { expenses } = useExpenses();
  const { categories } = useBudgets();
  const streak = useStreaks();

  const calculateScore = () => {
    if (expenses.length === 0) return 0;

    const totalBudget = categories.reduce((sum, c) => sum + c.budgetAmount, 0);
    const totalSpent = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    
    // 1. Budget Adherence (40%)
    let budgetScore = 100;
    if (totalBudget > 0) {
      const ratio = totalSpent / totalBudget;
      if (ratio > 1) budgetScore = Math.max(0, 100 - (ratio - 1) * 100);
    }

    // 2. Streak Bonus (20%)
    const streakScore = Math.min(streak * 5, 100);

    // 3. Savings Rate (30%) - Assuming any income > 0
    const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    let savingsScore = 0;
    if (totalIncome > 0) {
      const savingsRate = (totalIncome - totalSpent) / totalIncome;
      savingsScore = Math.max(0, savingsRate * 100);
    }

    // 4. Data Diversity (10%)
    const uniqueCats = new Set(expenses.map(e => e.categoryId)).size;
    const diversityScore = Math.min(uniqueCats * 20, 100);

    return Math.round(budgetScore * 0.4 + streakScore * 0.2 + savingsScore * 0.3 + diversityScore * 0.1);
  };

  const score = calculateScore();
  const color = score > 70 ? 'text-emerald-500' : score > 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="glass p-6 rounded-[32px] flex items-center justify-between border border-white/10 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 to-transparent pointer-events-none" />
      
      <div className="space-y-1 relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Health Score <Activity size={18} className="text-primary-start" />
        </h2>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Your financial well-being</p>
      </div>

      <div className="relative flex items-center justify-center h-24 w-24 z-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="38"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={238.76}
            initial={{ strokeDashoffset: 238.76 }}
            animate={{ strokeDashoffset: 238.76 - (238.76 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={color}
          />
        </svg>
        <span className={`absolute text-2xl font-black ${color}`}>{score}</span>
      </div>
    </div>
  );
};
