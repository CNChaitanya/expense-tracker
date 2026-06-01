import React, { useState, useEffect } from 'react';
import { useExpenses, useTemplates } from '../hooks/useExpenses';
import { X, Sparkles, Tag, Plus, Check } from 'lucide-react';
import { ReceiptUploader } from './ReceiptUploader';
import { playSound } from '../lib/sounds';
import { triggerConfetti } from '../lib/confetti';
import { useNotifications } from '../hooks/useNotification';
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

const CATEGORIES = [
  { id: 'food', name: 'Food', emoji: '🍔' },
  { id: 'transport', name: 'Transport', emoji: '🚗' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍' },
  { id: 'housing', name: 'Housing', emoji: '🏠' },
  { id: 'health', name: 'Health', emoji: '💊' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'education', name: 'Education', emoji: '📚' },
  { id: 'other', name: 'Other', emoji: '✨' },
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, editExpenseId }) => {
  const { categories: dbCategories, addExpense, updateExpense, expenses } = useExpenses();
  const { templates, addTemplate } = useTemplates();
  const { addToast } = useNotifications();
  const [isTemplateSaving, setIsTemplateSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'upi' | 'bank',
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
          paymentMethod: exp.paymentMethod as any,
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
    addToast("Template applied!", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) {
      addToast("Please fill in amount and category", "error");
      return;
    }

    try {
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
        addToast("Transaction updated!", "success");
      } else {
        await addExpense(data);
        addToast("Transaction saved!", "success");
        triggerConfetti();
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
    } catch (error) {
      console.error("Save error:", error);
      addToast("Failed to save transaction", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[150] p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass w-full max-w-4xl min-h-[80vh] rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative"
      >
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-start/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        {/* Left Sidebar of Modal: Context & Tips */}
        <div className="md:w-1/3 bg-gradient-to-br from-primary-start/20 to-primary-end/20 p-10 flex flex-col border-r border-white/5 relative z-10">
          <div className="space-y-8 flex-1">
            <div>
               <h2 className="text-4xl font-black tracking-tight text-white mb-2">{editExpenseId ? 'Update' : 'New'}</h2>
               <div className="h-1.5 w-16 bg-gradient-to-r from-primary-start to-primary-end rounded-full" />
            </div>

            {!editExpenseId && templates.length > 0 && (
              <div className="space-y-4">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Recent Templates</p>
                <div className="grid grid-cols-1 gap-2">
                  {templates.slice(0, 4).map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => applyTemplate(t)}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-left text-xs font-bold transition-all border border-white/5 flex items-center justify-between group"
                    >
                      <span>{t.name}</span>
                      <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Transaction Mood</p>
               <div className="grid grid-cols-5 gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setFormData({ ...formData, mood: m.id })}
                      className={`text-3xl p-3 rounded-2xl transition-all ${formData.mood === m.id ? 'bg-white/10 scale-110 shadow-lg border border-white/10' : 'opacity-30 hover:opacity-100 hover:bg-white/5'}`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5">
             <div className="flex items-center gap-3 text-primary-start mb-2">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Pro Tip</span>
             </div>
             <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Add descriptive notes and tags to help our AI Coach give you better financial insights!
             </p>
          </div>
        </div>

        {/* Right Side: Main Form */}
        <div className="flex-1 p-10 md:p-14 overflow-y-auto no-scrollbar relative z-10">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white"
          >
            <X size={28} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
            {/* Type Toggle */}
            <div className="flex p-1.5 bg-white/5 rounded-[24px] border border-white/5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-4 rounded-[18px] text-sm font-black uppercase tracking-widest transition-all ${formData.type === 'expense' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl shadow-red-500/20' : 'text-gray-500'}`}
              >
                💸 Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-4 rounded-[18px] text-sm font-black uppercase tracking-widest transition-all ${formData.type === 'income' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl shadow-emerald-500/20' : 'text-gray-500'}`}
              >
                💰 Income
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="relative group text-center">
                <span className="absolute left-1/2 -translate-x-32 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-600 group-focus-within:text-primary-start transition-colors">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  className="w-full bg-transparent text-center text-7xl font-black tabular-nums transition-all outline-none placeholder-white/5"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Category Chips */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Select Category</label>
               <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                  {dbCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      className={`shrink-0 flex flex-col items-center gap-2 p-4 rounded-[24px] border-2 transition-all min-w-[100px] ${formData.categoryId === cat.id ? 'bg-primary-start/10 border-primary-start text-white' : 'bg-white/5 border-transparent text-gray-500 hover:border-white/10'}`}
                    >
                      <span className="text-3xl">{(CATEGORIES.find(c => c.name === cat.name)?.emoji) || '✨'}</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{cat.name}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Date & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Transaction Date</label>
                  <div className="flex gap-2">
                     <input
                        type="date"
                        required
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-primary-start transition-all"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                     />
                     <button type="button" onClick={() => setFormData({ ...formData, date: new Date().toISOString().split('T')[0] })} className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all shrink-0">Today</button>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 text-center block">Payment Method</label>
                  <div className="flex gap-2">
                    {(['cash', 'card', 'upi', 'bank'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        className={`flex-1 py-4 rounded-2xl transition-all border flex items-center justify-center ${formData.paymentMethod === method ? 'bg-primary-start/20 border-primary-start text-primary-start scale-105 shadow-lg shadow-primary-start/10' : 'bg-white/5 border-white/10 text-gray-600 hover:text-gray-400'}`}
                        title={method.toUpperCase()}
                      >
                        {method === 'cash' && '💵'}
                        {method === 'card' && '💳'}
                        {method === 'upi' && '📱'}
                        {method === 'bank' && '🏦'}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Note & Tags */}
            <div className="grid grid-cols-1 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Notes (Markdown Supported)</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-[28px] px-8 py-6 font-medium transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start h-28 resize-none outline-none"
                    placeholder="What was this for? Use **bold** or *italic*..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Tags</label>
                  <div className="relative group">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-start transition-colors" size={20} />
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 font-bold focus:border-primary-start outline-none transition-all"
                      placeholder="trip, dinner, office..."
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
               </div>
            </div>

            {/* Receipt & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-8">
              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-center gap-2">
                    <ReceiptUploader 
                        onUpload={(img) => setFormData({ ...formData, receiptImage: img })} 
                        currentImage={formData.receiptImage} 
                    />
                    <span className="text-[10px] font-black uppercase text-gray-500">Camera</span>
                 </div>
                 
                 {!editExpenseId && (
                   <button 
                     type="button"
                     onClick={() => setIsTemplateSaving(!isTemplateSaving)}
                     className={`flex flex-col items-center gap-2 transition-all ${isTemplateSaving ? 'text-primary-start' : 'text-gray-500 hover:text-white'}`}
                   >
                     <div className={`p-4 rounded-2xl border-2 transition-all ${isTemplateSaving ? 'bg-primary-start/10 border-primary-start' : 'bg-white/5 border-transparent'}`}>
                        <Plus size={20} />
                     </div>
                     <span className="text-[10px] font-black uppercase">Template</span>
                   </button>
                 )}
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:px-12 py-6 bg-gradient-to-r from-primary-start via-primary-end to-indigo-600 text-white font-black text-lg rounded-[24px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-start/30 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {editExpenseId ? 'Confirm Update' : 'Save Transaction'} <Check size={24} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
