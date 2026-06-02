import React from 'react';
import { formatCurrency } from '../lib/currency';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

import { motion } from 'framer-motion';

interface SummaryCardsProps {
  spent: number;
  income: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ spent, income }) => {
  const balance = income - spent;
  
  const animatedSpent = useAnimatedNumber(spent);
  const animatedIncome = useAnimatedNumber(income);
  const animatedBalance = useAnimatedNumber(balance);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass p-6 rounded-3xl h-40 flex flex-col justify-center border-l-4 border-red-500 shadow-xl shadow-red-500/5 card-hover">
        <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Total Spent</span>
        <motion.span 
          key={spent}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="text-4xl lg:text-5xl font-black text-red-500 tabular-nums tracking-tighter"
        >
           ₹{formatCurrency(animatedSpent)}
        </motion.span>
      </div>
      <div className="glass p-6 rounded-3xl h-40 flex flex-col justify-center border-l-4 border-emerald-500 shadow-xl shadow-emerald-500/5 card-hover">
        <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Total Income</span>
        <motion.span 
          key={income}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="text-4xl lg:text-5xl font-black text-emerald-500 tabular-nums tracking-tighter"
        >
           ₹{formatCurrency(animatedIncome)}
        </motion.span>
      </div>
      <div className="glass p-6 rounded-3xl h-40 flex flex-col justify-center border-l-4 border-primary-start shadow-xl shadow-primary-start/5 card-hover overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 to-primary-end/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 relative z-10">Net Balance</span>
        <motion.span 
          key={balance}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="text-4xl lg:text-5xl font-black text-gradient tabular-nums tracking-tighter relative z-10"
        >
           ₹{formatCurrency(animatedBalance)}
        </motion.span>
      </div>
    </div>
  );
};
