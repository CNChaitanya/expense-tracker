import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useExpenses } from '../hooks/useExpenses';

export const CategoryChart: React.FC = () => {
  const { expenses, categories } = useExpenses();

  const data = categories.map(cat => {
    const total = expenses
      .filter(e => e.categoryId === cat.id && e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: cat.name,
      value: total / 100, // Show as decimal for chart
      color: cat.color.includes('orange') ? '#f97316' : 
             cat.color.includes('blue') ? '#3b82f6' : 
             cat.color.includes('purple') ? '#a855f7' : 
             cat.color.includes('green') ? '#22c55e' : 
             cat.color.includes('pink') ? '#ec4899' : '#8884d8'
    };
  }).filter(d => d.value > 0);

  return (
    <div className="glass dark:glass-dark p-6 rounded-3xl h-[400px] flex flex-col">
      <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(3, 7, 18, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 italic">
          No data available
        </div>
      )}
    </div>
  );
};
