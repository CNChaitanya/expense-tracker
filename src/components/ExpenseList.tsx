import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';
import { Trash2, ShoppingBag, Utensils, Bus, Home, Film, HelpCircle } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Utensils,
  Bus,
  ShoppingBag,
  Home,
  Film,
};

export const ExpenseList: React.FC = () => {
  const { expenses, categories, deleteExpense } = useExpenses();

  const getCategory = (id: string) => categories.find(c => c.id === id);

  if (expenses.length === 0) {
    return (
      <div className="glass dark:glass-dark p-8 rounded-3xl min-h-[400px] flex items-center justify-center text-gray-400 italic">
        No transactions found. Click '+' to add one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-1">Recent Transactions</h2>
      <div className="space-y-3">
        {expenses.map((expense) => {
          const category = getCategory(expense.categoryId);
          const Icon = category ? ICON_MAP[category.icon] || HelpCircle : HelpCircle;
          
          return (
            <div key={expense.id} className="glass dark:glass-dark p-4 rounded-2xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${category?.color || 'text-gray-500'}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-bold">{category?.name || 'Uncategorized'}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString()} • {expense.paymentMethod.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-lg font-bold ${expense.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                  {expense.type === 'expense' ? '-' : '+'}${formatCurrency(expense.amount)}
                </div>
                <button 
                  onClick={() => deleteExpense(expense.id)}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
