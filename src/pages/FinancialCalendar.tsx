import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency } from '../lib/currency';

export const FinancialCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { expenses } = useExpenses();
  const { categories } = useBudgets();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const totalMonthlyBudget = categories.reduce((sum, c) => sum + c.budgetAmount, 0);
  const dailyBudget = totalMonthlyBudget / 30;

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDayExpenses = (day: number) => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const bestDay = days.reduce((acc, day) => {
     const total = getDayExpenses(day).filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
     if (total > 0 && total < acc.val) return { day, val: total };
     return acc;
  }, { day: 0, val: Infinity });

  const worstDay = days.reduce((acc, day) => {
    const total = getDayExpenses(day).filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    if (total > acc.val) return { day, val: total };
    return acc;
  }, { day: 0, val: 0 });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Financial Calendar</h1>
           <p className="text-gray-500 font-medium">Your month in one beautiful view</p>
        </div>
        
        <div className="flex items-center gap-4 glass px-6 py-3 rounded-[24px] border border-white/5 shadow-2xl">
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft size={20} /></button>
          <span className="font-black min-w-[140px] text-center text-sm uppercase tracking-widest">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronRight size={20} /></button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="glass p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Best Day</p>
            <p className="text-xl font-bold text-emerald-500">Day {bestDay.day || '--'} (₹{formatCurrency(bestDay.val === Infinity ? 0 : bestDay.val)})</p>
         </div>
         <div className="glass p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Worst Day</p>
            <p className="text-xl font-bold text-red-500">Day {worstDay.day || '--'} (₹{formatCurrency(worstDay.val)})</p>
         </div>
         <div className="glass p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Activity</p>
            <p className="text-xl font-bold text-primary-start">{days.filter(d => getDayExpenses(d).length > 0).length} Days with transactions</p>
         </div>
      </div>

      <div className="glass rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.4)] border border-white/10 bg-[#030712]/40 backdrop-blur-3xl relative">
        <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {padding.map(p => <div key={`p-${p}`} className="h-28 sm:h-40 border-r border-b border-white/5 bg-white/[0.01]" />)}
          {days.map(day => {
            const dayExpenses = getDayExpenses(day);
            const total = dayExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
            const hasIncome = dayExpenses.some(e => e.type === 'income');
            const isOver = dailyBudget > 0 && total > dailyBudget;
            
            return (
              <div 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className={`h-28 sm:h-40 border-r border-b border-white/5 p-4 relative group cursor-pointer transition-all hover:bg-white/5 ${isOver ? 'bg-red-500/[0.03]' : total > 0 ? 'bg-emerald-500/[0.03]' : ''}`}
              >
                <span className={`text-sm font-black transition-colors ${total > 0 ? 'text-white' : 'text-gray-600'}`}>{day}</span>
                
                {hasIncome && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}

                <div className="mt-2 space-y-1">
                   {total > 0 && (
                      <div className={`py-1.5 px-2 rounded-xl text-[10px] font-black text-center truncate shadow-lg ${isOver ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                         ₹{formatCurrency(total)}
                      </div>
                   )}
                   <div className="hidden sm:block space-y-1">
                      {dayExpenses.slice(0, 2).map(e => (
                         <p key={e.id} className="text-[9px] font-medium text-gray-500 truncate opacity-60 group-hover:opacity-100">
                            {e.note || categories.find(c => c.id === e.categoryId)?.name}
                         </p>
                      ))}
                      {dayExpenses.length > 2 && <p className="text-[8px] font-black text-primary-start uppercase">+{dayExpenses.length - 2} more</p>}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="glass w-full max-w-lg p-10 rounded-[40px] space-y-8"
               onClick={e => e.stopPropagation()}
             >
                <div className="flex justify-between items-center">
                   <h2 className="text-3xl font-black">Day {selectedDay} Summary</h2>
                   <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                   {getDayExpenses(selectedDay).map(e => (
                      <div key={e.id} className="flex justify-between items-center p-5 bg-white/5 rounded-3xl border border-white/5">
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-white/5 ${e.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                               {e.type === 'expense' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                            </div>
                            <div>
                               <p className="font-bold text-sm">{e.note || categories.find(c => c.id === e.categoryId)?.name}</p>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{e.paymentMethod}</p>
                            </div>
                         </div>
                         <span className={`font-black text-lg ${e.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {e.type === 'expense' ? '-' : '+'}₹{formatCurrency(e.amount)}
                         </span>
                      </div>
                   ))}
                   {getDayExpenses(selectedDay).length === 0 && (
                      <p className="text-center py-10 text-gray-500 font-bold italic">No transactions on this day.</p>
                   )}
                </div>

                <button onClick={() => setSelectedDay(null)} className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">Close</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
