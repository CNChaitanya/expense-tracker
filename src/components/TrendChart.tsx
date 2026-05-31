import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';

export const TrendChart: React.FC = () => {
  const { expenses } = useExpenses();

  // Group expenses by day for the current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayTotal = expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getDate() === day && 
               d.getMonth() === now.getMonth() && 
               d.getFullYear() === now.getFullYear() &&
               e.type === 'expense';
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      day,
      amount: dayTotal / 100,
    };
  });

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl h-[400px]">
      <h2 className="text-xl font-bold mb-4">Daily Spending Trend</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(3, 7, 18, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--primary-start)" 
            strokeWidth={4} 
            dot={{ r: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary-start)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
