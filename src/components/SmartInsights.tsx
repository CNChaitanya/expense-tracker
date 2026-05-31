import React, { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';
import { Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { formatCurrency } from '../lib/currency';

export const SmartInsights: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const { categories: budgets } = useBudgets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getInsights = () => {
    const insights = [];
    if (expenses.length === 0) return [{ icon: <Lightbulb />, text: "Add some expenses to get smart insights!" }];

    // Insight 1: Top Category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      if (e.type === 'expense') {
        categoryTotals[e.categoryId] = (categoryTotals[e.categoryId] || 0) + e.amount;
      }
    });
    
    let topCatId = '';
    let maxAmt = 0;
    for (const [id, amt] of Object.entries(categoryTotals)) {
      if (amt > maxAmt) { maxAmt = amt; topCatId = id; }
    }
    
    const topCatName = categories.find(c => c.id === topCatId)?.name || 'Unknown';
    if (maxAmt > 0) {
      insights.push({
        icon: <TrendingUp className="text-orange-500" />,
        text: `${topCatName} is your #1 category this month (₹${formatCurrency(maxAmt)} spent).`
      });
    }

    // Insight 2: Biggest Single Expense
    const biggest = [...expenses].filter(e => e.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
    if (biggest) {
      insights.push({
        icon: <AlertTriangle className="text-red-500" />,
        text: `Your biggest single expense was ₹${formatCurrency(biggest.amount)} for ${biggest.note || getCategoryName(biggest.categoryId, categories)}.`
      });
    }

    // Insight 3: On Track
    const totalBudget = budgets.reduce((sum, c) => sum + c.budgetAmount, 0);
    const totalSpent = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    if (totalBudget > 0) {
      const isUnder = totalSpent <= totalBudget;
      insights.push({
        icon: <Target className={isUnder ? "text-green-500" : "text-red-500"} />,
        text: isUnder ? "You're on track to stay under budget this month! 🎉" : "You've exceeded your total budget limit. ⚠️"
      });
    }

    return insights.length > 0 ? insights : [{ icon: <Lightbulb />, text: "Keep tracking to see more insights." }];
  };

  const getCategoryName = (id: string, cats: any[]) => cats.find(c => c.id === id)?.name || 'Unknown';

  const insights = getInsights();

  useEffect(() => {
    if (insights.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [insights.length]);

  return (
    <div className="glass dark:glass-dark p-4 rounded-2xl flex items-center gap-4 overflow-hidden relative min-h-[80px]">
      <div className="shrink-0 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50">
        {insights[currentIndex].icon}
      </div>
      <div 
        key={currentIndex} 
        className="animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <p className="font-medium text-sm md:text-base">{insights[currentIndex].text}</p>
      </div>
    </div>
  );
};
