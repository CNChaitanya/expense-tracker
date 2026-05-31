import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';
import { ShoppingBag, Utensils, Bus, Home, Film, HelpCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../lib/animations';

const ICON_MAP: Record<string, any> = {
  Utensils,
  Bus,
  ShoppingBag,
  Home,
  Film,
};

export const TransactionTimeline: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Timeline</h1>
        <p className="text-gray-500 font-medium">Your financial journey, visualized through time</p>
      </header>

      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {expenses.map((expense, idx) => {
            const category = getCategory(expense.categoryId);
            const Icon = category ? ICON_MAP[category.icon] || HelpCircle : HelpCircle;
            const isEven = idx % 2 === 0;

            return (
              <motion.div 
                key={expense.id} 
                variants={itemVariants}
                className={`relative flex items-center justify-between w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Connector Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#030712] border-2 border-white/10 flex items-center justify-center z-10 hidden md:flex">
                   <div className={`w-3 h-3 rounded-full ${expense.type === 'expense' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] glass p-6 rounded-[32px] group card-hover relative overflow-hidden ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`flex items-center gap-4 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    <div className={`p-4 rounded-2xl bg-white/5 ${category?.color || 'text-gray-500'}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{new Date(expense.date).toLocaleDateString()}</span>
                      <h3 className="text-xl font-bold">{expense.note || category?.name}</h3>
                    </div>
                  </div>
                  
                  <div className={`mt-4 text-3xl font-black font-mono tabular-nums ${expense.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {expense.type === 'expense' ? '-' : '+'}₹{formatCurrency(expense.amount)}
                  </div>

                  <div className={`mt-2 flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                     {expense.type === 'expense' ? <ArrowDownCircle size={12} className="text-red-500" /> : <ArrowUpCircle size={12} className="text-emerald-500" />}
                     {expense.paymentMethod} • {category?.name}
                  </div>
                </div>

                {/* Empty spacer for alignment */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
