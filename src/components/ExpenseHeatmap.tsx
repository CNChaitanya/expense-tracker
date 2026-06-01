import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';
import { motion } from 'framer-motion';

export const ExpenseHeatmap: React.FC = () => {
  const { expenses } = useExpenses();
  const [mode, setMode] = useState<'spend' | 'frequency'>('spend');

  const getHeatmapData = () => {
    const today = new Date();
    const data = [];
    let maxValue = 0;
    
    // Generate last 365 days (approx 52 weeks)
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTransactions = expenses.filter(e => new Date(e.date).toISOString().split('T')[0] === dateStr);
      const dayTotal = dayTransactions.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      const dayFreq = dayTransactions.length;

      const val = mode === 'spend' ? dayTotal : dayFreq;
      if (val > maxValue) maxValue = val;
      
      data.push({ date: dateStr, value: val, count: dayFreq, total: dayTotal });
    }
    
    return { data, maxValue };
  };

  const { data, maxValue } = getHeatmapData();

  const getColor = (val: number) => {
    if (val === 0) return 'bg-white/5';
    const intensity = maxValue > 0 ? val / maxValue : 0;
    if (intensity < 0.25) return 'bg-primary-start/20';
    if (intensity < 0.5) return 'bg-primary-start/40';
    if (intensity < 0.75) return 'bg-primary-start/70';
    return 'bg-primary-start shadow-[0_0_10px_rgba(var(--primary-glow),0.5)]';
  };

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="glass p-8 rounded-[40px] space-y-6 overflow-hidden border border-white/5 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-start/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
           <h2 className="text-2xl font-black uppercase tracking-tight">Spending Heatmap</h2>
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Activity over the last 52 weeks</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
           <button 
             onClick={() => setMode('spend')}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'spend' ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
           >
             Spend
           </button>
           <button 
             onClick={() => setMode('frequency')}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'frequency' ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
           >
             Frequency
           </button>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 relative z-10">
        <div className="flex gap-1.5" style={{ width: 'max-content' }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wIdx * 0.01) + (dIdx * 0.005) }}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[3px] transition-all hover:scale-150 cursor-pointer group relative ${getColor(day.value)}`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-950 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100] transition-all shadow-2xl border border-white/10 scale-50 group-hover:scale-100 origin-bottom">
                    <p className="text-gray-400 mb-1">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-sm font-black">₹{formatCurrency(day.total)}</p>
                    <p className="text-[9px] opacity-50 uppercase tracking-tighter mt-1">{day.count} transactions</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between relative z-10">
         <div className="flex gap-4">
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
               <span key={m} className="text-[9px] font-black uppercase text-gray-600 tracking-widest">{m}</span>
            ))}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
           <span>Less</span>
           <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px] bg-white/5"></div>
              <div className="w-3 h-3 rounded-[2px] bg-primary-start/20"></div>
              <div className="w-3 h-3 rounded-[2px] bg-primary-start/40"></div>
              <div className="w-3 h-3 rounded-[2px] bg-primary-start/70"></div>
              <div className="w-3 h-3 rounded-[2px] bg-primary-start"></div>
           </div>
           <span>More</span>
         </div>
      </div>
    </div>
  );
};
