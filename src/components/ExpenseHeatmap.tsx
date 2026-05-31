import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/currency';

export const ExpenseHeatmap: React.FC = () => {
  const { expenses } = useExpenses();

  const getHeatmapData = () => {
    const today = new Date();
    const data = [];
    let maxSpend = 0;
    
    // Generate last 84 days (12 weeks)
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTotal = expenses
        .filter(e => e.type === 'expense' && new Date(e.date).toISOString().split('T')[0] === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      if (dayTotal > maxSpend) maxSpend = dayTotal;
      data.push({ date: dateStr, amount: dayTotal });
    }
    
    return { data, maxSpend };
  };

  const { data, maxSpend } = getHeatmapData();

  const getColor = (amount: number) => {
    if (amount === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (amount < maxSpend * 0.25) return 'bg-green-200 dark:bg-green-900';
    if (amount < maxSpend * 0.5) return 'bg-green-400 dark:bg-green-700';
    if (amount < maxSpend * 0.75) return 'bg-yellow-400 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl space-y-4 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Spending Heatmap</h2>
        <span className="text-xs text-gray-500">Last 12 weeks</span>
      </div>
      
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-1" style={{ width: 'max-content' }}>
          {/* Group into weeks (columns of 7) */}
          {Array.from({ length: 12 }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const dayData = data[weekIdx * 7 + dayIdx];
                if (!dayData) return null;
                return (
                  <div
                    key={dayData.date}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-transform hover:scale-125 cursor-pointer group relative ${getColor(dayData.amount)}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {new Date(dayData.date).toLocaleDateString()}: ₹{formatCurrency(dayData.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
        <div className="w-3 h-3 rounded-sm bg-yellow-400 dark:bg-yellow-600"></div>
        <div className="w-3 h-3 rounded-sm bg-red-500 dark:bg-red-600"></div>
        <span>More</span>
      </div>
    </div>
  );
};
