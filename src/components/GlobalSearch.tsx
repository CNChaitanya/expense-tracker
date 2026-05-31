import React, { useState, useEffect, useRef } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { Search, X, Calendar, Tag } from 'lucide-react';
import { formatCurrency } from '../lib/currency';

import { EmptySearch } from './EmptyStates';

export const GlobalSearch: React.FC<{ onClose: () => void; onNavigate: (page: string) => void }> = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { expenses, categories } = useExpenses();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Uncategorized';

  const results = query ? expenses.filter(e => 
    e.note?.toLowerCase().includes(query.toLowerCase()) ||
    getCategoryName(e.categoryId).toLowerCase().includes(query.toLowerCase()) ||
    formatCurrency(e.amount).includes(query)
  ).slice(0, 10) : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-start pt-[20vh] p-4" onClick={onClose}>
      <div 
        className="glass dark:glass-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
          <Search className="text-gray-400" size={24} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-xl font-medium focus:outline-none placeholder-gray-400"
            placeholder="Search expenses..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map(expense => (
                  <button 
                    key={expense.id}
                    onClick={() => { onNavigate('expenses'); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold group-hover:text-accent transition-colors">
                        {expense.note || getCategoryName(expense.categoryId)}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Tag size={12} /> {getCategoryName(expense.categoryId)}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`font-bold ${expense.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                      {expense.type === 'expense' ? '-' : '+'}₹{formatCurrency(expense.amount)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptySearch query={query} />
            )}
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 text-xs text-gray-500 flex justify-between items-center border-t border-gray-200 dark:border-gray-800">
          <span>Navigate with <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono">↓</kbd></span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-mono">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
