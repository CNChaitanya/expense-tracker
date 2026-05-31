import { useState, useEffect } from 'react';
import { useExpenses } from './useExpenses';
import { useBudgets } from './useBudgets';
import { triggerConfetti } from '../lib/confetti';

export const useStreaks = () => {
  const { expenses } = useExpenses();
  const { categories } = useBudgets();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Basic logic for streak: count consecutive days where total spent <= daily budget limit.
    // For simplicity: calculate total monthly budget / 30 = daily limit.
    const totalBudget = categories.reduce((sum, c) => sum + c.budgetAmount, 0);
    const dailyLimit = totalBudget > 0 ? totalBudget / 30 : 500000; // default 5000 if no budget

    const today = new Date();
    today.setHours(0,0,0,0);
    
    let currentStreak = 0;
    
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const daySpend = expenses
        .filter(e => e.type === 'expense' && new Date(e.date).toISOString().split('T')[0] === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      if (daySpend <= dailyLimit) {
        currentStreak++;
      } else {
        break; // streak broken
      }
    }

    const prevStreak = parseInt(localStorage.getItem('spending_streak') || '0', 10);
    if (currentStreak > prevStreak && currentStreak % 7 === 0) {
      triggerConfetti(); // Milestone!
    }

    localStorage.setItem('spending_streak', currentStreak.toString());
    setStreak(currentStreak);

  }, [expenses, categories]);

  return streak;
};
