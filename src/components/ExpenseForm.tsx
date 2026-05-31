import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { X } from 'lucide-react';

import { ReceiptUploader } from './ReceiptUploader';

import { playSound } from '../lib/sounds';

interface ExpenseFormProps {
  onClose: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose }) => {
  const { categories, addExpense } = useExpenses();
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'upi',
    type: 'expense' as 'expense' | 'income',
    receiptImage: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    await addExpense({
      amount: Math.round(parseFloat(formData.amount) * 100),
      categoryId: formData.categoryId,
      date: new Date(formData.date),
      note: formData.note,
      paymentMethod: formData.paymentMethod,
      type: formData.type,
      isRecurring: false,
      receiptImage: formData.receiptImage,
    });
    playSound('add');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="glass dark:glass-dark w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${formData.type === 'expense' ? 'bg-white dark:bg-gray-700 shadow-sm text-red-500' : 'text-gray-500'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${formData.type === 'income' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-500' : 'text-gray-500'}`}
            >
              Income
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Category</label>
              <select
                required
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Date</label>
              <input
                type="date"
                required
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Note</label>
            <textarea
              className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent h-24 resize-none"
              placeholder="What was this for?"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          <div className="flex justify-between items-center gap-4">
             <ReceiptUploader 
                onUpload={(img) => setFormData({ ...formData, receiptImage: img })} 
                currentImage={formData.receiptImage} 
             />
             <button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/25"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
