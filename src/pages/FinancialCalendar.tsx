import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency } from '../lib/currency';

export const FinancialCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Calendar</h1>
        <div className="flex items-center gap-4 glass px-4 py-2 rounded-2xl">
          <button onClick={prevMonth} className="p-1 hover:bg-white/5 rounded-lg"><ChevronLeft size={20} /></button>
          <span className="font-bold min-w-[120px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-white/5 rounded-lg"><ChevronRight size={20} /></button>
        </div>
      </header>

      <div className="glass rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
        <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {padding.map(p => <div key={`p-${p}`} className="h-24 sm:h-32 border-r border-b border-white/5 opacity-20" />)}
          {days.map(day => {
            const dayExpenses = getDayExpenses(day);
            const total = dayExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
            const isOver = dailyBudget > 0 && total > dailyBudget;
            
            return (
              <div key={day} className="h-24 sm:h-32 border-r border-b border-white/5 p-2 relative group hover:bg-white/5 transition-all">
                <span className="text-xs font-black text-gray-500">{day}</span>
                {total > 0 && (
                   <div className={`mt-2 p-1.5 rounded-lg text-[10px] font-black text-center truncate ${isOver ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      ₹{formatCurrency(total)}
                   </div>
                )}
                {dayExpenses.length > 3 && (
                   <div className="mt-1 text-[8px] text-center font-bold text-gray-600">+{dayExpenses.length - 3} more</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 items-center glass p-4 rounded-2xl text-xs font-medium text-gray-500">
         <Info size={14} className="text-primary-start" />
         <span>Days highlighted in red exceed your average daily budget of ₹{formatCurrency(Math.round(dailyBudget))}.</span>
      </div>
    </div>
  );
};
