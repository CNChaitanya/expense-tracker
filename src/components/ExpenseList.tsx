import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';
import { Trash2, ShoppingBag, Utensils, Bus, Home, Film, HelpCircle, Image as ImageIcon, Edit2, Copy, Filter, X } from 'lucide-react';
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

const MOOD_MAP: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  regret: '😔',
  excited: '🤩',
  stressed: '😤',
};

interface ExpenseListProps {
  onEdit?: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit }) => {
  const { expenses, categories, deleteExpense, duplicateExpense } = useExpenses();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getCategory = (id: string) => categories.find(c => c.id === id);

  const handleDelete = (id: string) => {
    if (confirm('Delete this transaction?')) {
      playSound('delete');
      deleteExpense(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateExpense(id);
    playSound('success');
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = !filterCategory || e.categoryId === filterCategory;
    const catName = getCategory(e.categoryId)?.name || '';
    const matchesSearch = !searchQuery || 
      e.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      catName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (expenses.length === 0) {
    return (
      <div className="glass rounded-3xl min-h-[400px] flex items-center justify-center">
        <EmptyWallet />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl">
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
            <Filter size={16} className="text-gray-500 shrink-0" />
            <button 
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${!filterCategory ? 'bg-primary-start text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${filterCategory === cat.id ? 'bg-primary-start text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
              >
                {cat.name}
              </button>
            ))}
         </div>
         <div className="relative w-full md:w-64">
            <input 
              type="text"
              placeholder="Search in list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary-start transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            )}
         </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filteredExpenses.map((expense) => {
          const category = getCategory(expense.categoryId);
          const Icon = category ? ICON_MAP[category.icon] || HelpCircle : HelpCircle;
          
          return (
            <motion.div 
              key={expense.id} 
              variants={itemVariants}
              className="glass p-4 rounded-2xl flex items-center justify-between group card-hover relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl bg-white/5 ${category?.color || 'text-gray-500'} relative`}>
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  {expense.mood && (
                    <span className="absolute -top-1 -right-1 text-xs drop-shadow-sm">{MOOD_MAP[expense.mood]}</span>
                  )}
                </div>
                <div>
                  <div className="font-bold tracking-tight flex items-center gap-2">
                    {category?.name || 'Uncategorized'}
                    {expense.isRecurring && <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Recurring</span>}
                  </div>
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
                  {expense.note && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic max-w-xs">{expense.note.replace(/\*\*/g, '')}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className={`text-lg font-black font-mono tabular-nums ${expense.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {expense.type === 'expense' ? '-' : '+'}₹{formatCurrency(expense.amount)}
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleDuplicate(expense.id)}
                    title="Duplicate"
                    className="p-2 text-gray-500 hover:text-indigo-400 bg-white/5 rounded-lg transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={() => onEdit?.(expense.id)}
                    title="Edit"
                    className="p-2 text-gray-500 hover:text-primary-start bg-white/5 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    title="Delete"
                    className="p-2 text-gray-500 hover:text-red-500 bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredExpenses.length === 0 && (
           <div className="p-12 text-center text-gray-500 italic">
              No transactions match your filters.
           </div>
        )}
      </motion.div>

      {selectedReceipt && <Lightbox image={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
};
