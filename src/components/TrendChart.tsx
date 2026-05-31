import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';
import { useTheme } from '../store/ThemeContext';

export const TrendChart: React.FC = () => {
  const { expenses } = useExpenses();
  const { theme } = useTheme();

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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#aa3bff" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#aa3bff', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
