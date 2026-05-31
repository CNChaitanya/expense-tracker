import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';
import { Trash2, ShoppingBag, Utensils, Bus, Home, Film, HelpCircle, Image as ImageIcon } from 'lucide-react';
import { playSound } from '../lib/sounds';
import { EmptyWallet } from './EmptyStates';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../lib/animations';
import { Lightbox } from './visual/Lightbox';

const ICON_MAP: Record<string, any> = {
  Utensils,
  Bus,
  ShoppingBag,
  Home,
  Film,
};

export const ExpenseList: React.FC = () => {
  const { expenses, categories, deleteExpense } = useExpenses();
  const [selectedReceipt, setSelectedReceipt] = React.useState<string | null>(null);

  const getCategory = (id: string) => categories.find(c => c.id === id);

  const handleDelete = (id: string) => {
    playSound('delete');
    deleteExpense(id);
  };

  if (expenses.length === 0) {
    return (
      <div className="glass rounded-3xl min-h-[400px] flex items-center justify-center">
        <EmptyWallet />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-1">Recent Transactions</h2>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {expenses.map((expense) => {
          const category = getCategory(expense.categoryId);
          const Icon = category ? ICON_MAP[category.icon] || HelpCircle : HelpCircle;
          
          return (
            <motion.div 
              key={expense.id} 
              variants={itemVariants}
              className="glass p-4 rounded-2xl flex items-center justify-between group card-hover relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl bg-white/5 ${category?.color || 'text-gray-500'}`}>
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-bold tracking-tight">{category?.name || 'Uncategorized'}</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-2">
                    {new Date(expense.date).toLocaleDateString()} • {expense.paymentMethod}
                    {expense.receiptImage && (
                      <button 
                        onClick={() => setSelectedReceipt(expense.receiptImage)}
                        className="flex items-center gap-1 text-primary-start hover:underline cursor-pointer"
                      >
                        <ImageIcon size={12} />
                        View Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className={`text-lg font-black font-mono tabular-nums ${expense.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {expense.type === 'expense' ? '-' : '+'}₹{formatCurrency(expense.amount)}
                </div>
                <button 
                  onClick={() => handleDelete(expense.id)}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {selectedReceipt && <Lightbox image={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
};
