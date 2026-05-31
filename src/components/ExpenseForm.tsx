import React, { useState, useEffect } from 'react';
import { useExpenses, useTemplates } from '../hooks/useExpenses';
import { X, Sparkles, MessageSquare, Tag, Plus } from 'lucide-react';
import { ReceiptUploader } from './ReceiptUploader';
import { VoiceInput } from './VoiceInput';
import { playSound } from '../lib/sounds';
import { motion } from 'framer-motion';
import { modalVariants } from '../lib/animations';

interface ExpenseFormProps {
  onClose: () => void;
  editExpenseId?: string | null;
}

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'regret', emoji: '😔', label: 'Regret' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'stressed', emoji: '😤', label: 'Stressed' },
] as const;

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, editExpenseId }) => {
  const { categories, addExpense, updateExpense, expenses } = useExpenses();
  const { templates, addTemplate } = useTemplates();
  const [isTemplateSaving, setIsTemplateSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'upi',
    type: 'expense' as 'expense' | 'income',
    receiptImage: '',
    mood: undefined as typeof MOODS[number]['id'] | undefined,
    tags: '',
  });

  useEffect(() => {
    if (editExpenseId) {
      const exp = expenses.find(e => e.id === editExpenseId);
      if (exp) {
        setFormData({
          amount: (exp.amount / 100).toString(),
          categoryId: exp.categoryId,
          date: new Date(exp.date).toISOString().split('T')[0],
          note: exp.note || '',
          paymentMethod: exp.paymentMethod,
          type: exp.type,
          receiptImage: exp.receiptImage || '',
          mood: exp.mood,
          tags: exp.tags || '',
        });
      }
    }
  }, [editExpenseId, expenses]);

  const applyTemplate = (t: any) => {
    setFormData({
      ...formData,
      amount: t.amount ? (t.amount / 100).toString() : formData.amount,
      categoryId: t.categoryId || formData.categoryId,
      note: t.note || formData.note,
      paymentMethod: t.paymentMethod || formData.paymentMethod,
    });
    playSound('success');
  };

  const handleVoiceTranscript = (amount: string, categoryName: string, note: string) => {
    const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    setFormData({
      ...formData,
      amount: amount || formData.amount,
      categoryId: category?.id || formData.categoryId,
      note: note || formData.note,
    });
    playSound('success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    const data = {
      amount: Math.round(parseFloat(formData.amount) * 100),
      categoryId: formData.categoryId,
      date: new Date(formData.date),
      note: formData.note,
      paymentMethod: formData.paymentMethod,
      type: formData.type,
      isRecurring: false,
      receiptImage: formData.receiptImage,
      mood: formData.mood,
      tags: formData.tags,
    };

    if (editExpenseId) {
      await updateExpense(editExpenseId, data);
    } else {
      await addExpense(data);
      if (isTemplateSaving) {
        await addTemplate({
          name: formData.note || 'New Template',
          amount: data.amount,
          categoryId: data.categoryId,
          note: data.note,
          paymentMethod: data.paymentMethod,
        });
      }
    }
    playSound('add');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: Visual/Quick Actions */}
        <div className="md:w-1/3 bg-gradient-to-br from-primary-start to-primary-end p-8 text-white flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight">{editExpenseId ? 'Edit' : 'New'} Transaction</h2>
            
            {!editExpenseId && (
              <div className="space-y-4">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  {templates.slice(0, 5).map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => applyTemplate(t)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-all backdrop-blur-md"
                    >
                      {t.name}
                    </button>
                  ))}
                  {templates.length === 0 && <p className="text-white/40 text-xs italic">No templates yet</p>}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-white/80">
                   <Sparkles size={16} />
                   <span className="text-xs font-bold uppercase tracking-wider">Mood Tracker</span>
                </div>
                <div className="flex justify-between">
                  {MOODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setFormData({ ...formData, mood: m.id })}
                      className={`text-2xl p-2 rounded-xl transition-all ${formData.mood === m.id ? 'bg-white/20 scale-125 shadow-lg' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center md:hidden mb-4">
               <h2 className="text-xl font-bold">{editExpenseId ? 'Edit' : 'New'}</h2>
               <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${formData.type === 'expense' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${formData.type === 'income' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                Income
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400 group-focus-within:text-primary-start transition-colors">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-3xl font-black tabular-nums transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-center block">Payment Method</label>
                <div className="flex gap-2">
                  {(['cash', 'card', 'upi'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all border ${formData.paymentMethod === method ? 'bg-primary-start/10 border-primary-start text-primary-start' : 'bg-white/5 border-white/5 text-gray-500'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 font-bold appearance-none transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="" disabled className="bg-gray-900">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 font-bold transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Notes & Description</label>
                <span className="text-[10px] text-primary-start font-bold uppercase tracking-widest flex items-center gap-1"><MessageSquare size={10} /> Markdown Supported</span>
              </div>
              <textarea
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 font-medium transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start h-24 resize-none"
                placeholder="What was this for? (e.g. **Dinner** at Burger King)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tags (comma separated)</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 font-medium transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start"
                  placeholder="trip, office, food-porn"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="flex items-center gap-4">
                 <ReceiptUploader 
                    onUpload={(img) => setFormData({ ...formData, receiptImage: img })} 
                    currentImage={formData.receiptImage} 
                 />
                 <VoiceInput onTranscript={handleVoiceTranscript} />
              </div>
              
              {!editExpenseId && (
                <button 
                  type="button"
                  onClick={() => setIsTemplateSaving(!isTemplateSaving)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black transition-all ${isTemplateSaving ? 'bg-primary-start/10 border-primary-start text-primary-start' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
                >
                  <Plus size={14} />
                  Save as Template
                </button>
              )}

              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="hidden md:block px-6 py-4 rounded-2xl font-black text-sm text-gray-500 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:px-8 py-4 bg-gradient-to-r from-primary-start to-primary-end hover:shadow-lg hover:shadow-primary-start/20 text-white font-black rounded-2xl transition-all"
                >
                  {editExpenseId ? 'Update' : 'Save'} Transaction
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
