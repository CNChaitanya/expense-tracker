import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';
import { Trash2, ShoppingBag, Utensils, Bus, Home, Film, HelpCircle, Edit2, Copy, Filter, X, Search } from 'lucide-react';
import { playSound } from '../lib/sounds';
import { EmptyWallet } from './EmptyStates';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../lib/animations';
import { Lightbox } from './visual/Lightbox';
import { parseMarkdown } from '../lib/markdown';

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
      <div className="glass rounded-[32px] min-h-[400px] flex items-center justify-center">
        <EmptyWallet />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-5 rounded-[24px] border border-white/5">
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
            <Filter size={16} className="text-gray-500 shrink-0" />
            <button 
              onClick={() => setFilterCategory(null)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${!filterCategory ? 'bg-primary-start text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${filterCategory === cat.id ? 'bg-primary-start text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
              >
                {cat.name}
              </button>
            ))}
         </div>
         <div className="relative w-full md:w-72 group">
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-start transition-all outline-none"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            ) : (
               <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-start transition-colors" />
            )}
         </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredExpenses.map((expense) => {
          const category = getCategory(expense.categoryId);
          const Icon = category ? ICON_MAP[category.icon] || HelpCircle : HelpCircle;
          
          return (
            <motion.div 
              key={expense.id} 
              variants={itemVariants}
              className="glass p-6 rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between group card-hover relative overflow-hidden border border-white/5"
            >
              <div className="flex items-start gap-5 relative z-10 w-full sm:w-auto">
                <div className={`p-4 rounded-[20px] bg-white/5 ${category?.color || 'text-gray-500'} relative shadow-inner`}>
                  <Icon size={24} className="group-hover:scale-110 transition-transform" />
                  {expense.mood && (
                    <span className="absolute -top-1 -right-1 text-lg drop-shadow-md">{MOOD_MAP[expense.mood]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-lg tracking-tight flex items-center gap-3">
                    {category?.name || 'Uncategorized'}
                    {expense.isRecurring && <span className="text-[9px] bg-primary-start/20 text-primary-start px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Subscription</span>}
                  </div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                    {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {expense.paymentMethod}
                  </div>
                  
                  {expense.note && (
                    <div className="mt-3 p-4 bg-white/5 rounded-2xl border border-white/5 max-w-lg prose-invert">
                       {parseMarkdown(expense.note)}
                    </div>
                  )}

                  {expense.receiptImage && (
                    <div 
                      className="mt-4 relative w-32 h-20 rounded-2xl overflow-hidden border border-white/10 group/thumb cursor-pointer shadow-xl transition-all hover:scale-105 active:scale-95" 
                      onClick={() => setSelectedReceipt(expense.receiptImage)}
                    >
                       <img src={expense.receiptImage} className="w-full h-full object-cover" alt="Receipt" />
                       <div className="absolute inset-0 bg-primary-start/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                          <Search size={20} className="text-white" />
                       </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 sm:pl-6 sm:border-l border-white/5">
                <div className={`text-2xl font-black font-mono tabular-nums ${expense.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {expense.type === 'expense' ? '-' : '+'}₹{formatCurrency(expense.amount)}
                </div>
                
                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all scale-90 sm:scale-100">
                  <button 
                    onClick={() => handleDuplicate(expense.id)}
                    title="Duplicate"
                    className="p-3 text-gray-500 hover:text-primary-start bg-white/5 rounded-xl transition-all border border-transparent hover:border-primary-start/30"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    onClick={() => onEdit?.(expense.id)}
                    title="Edit"
                    className="p-3 text-gray-500 hover:text-primary-start bg-white/5 rounded-xl transition-all border border-transparent hover:border-primary-start/30"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    title="Delete"
                    className="p-3 text-gray-500 hover:text-red-500 bg-white/5 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredExpenses.length === 0 && (
           <div className="p-20 text-center text-gray-600 flex flex-col items-center gap-4">
              <Search size={48} className="opacity-20" />
              <p className="font-black uppercase tracking-widest text-xs italic">No transactions match your filters</p>
           </div>
        )}
      </motion.div>

      {selectedReceipt && <Lightbox image={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
};
