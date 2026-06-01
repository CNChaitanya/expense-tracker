import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency } from '../lib/currency';
import { fetchAIResponse } from '../services/anthropicService';
import { useNotifications } from '../hooks/useNotification';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const STARTER_SUGGESTIONS = [
  "Where am I overspending?",
  "How can I save ₹5000 more this month?",
  "Am I on track with my budget?",
  "Give me a savings plan"
];

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { expenses, categories } = useExpenses();
  const { categories: budgets } = useBudgets();
  const { addToast } = useNotifications();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const getFinancialSummary = () => {
    const totalSpent = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const topCategories = categories.map(c => ({
      name: c.name,
      spent: expenses.filter(e => e.categoryId === c.id && e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
    })).sort((a, b) => b.spent - a.spent).slice(0, 3);

    const totalBudget = budgets.reduce((sum, c) => sum + c.budgetAmount, 0);
    const budgetAdherence = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

    return `Total spent this month: ₹${formatCurrency(totalSpent)}. Total income: ₹${formatCurrency(totalIncome)}. 
    Top 3 categories: ${topCategories.map(c => `${c.name} (₹${formatCurrency(c.spent)})`).join(', ')}. 
    Budget Adherence: ${budgetAdherence.toFixed(1)}%. Savings Rate: ${savingsRate.toFixed(1)}%. 
    Total transactions: ${expenses.length}.`;
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const summary = getFinancialSummary();
      const aiResponse = await fetchAIResponse(newMessages, summary);
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (err: any) {
      addToast(err.message, "error");
      setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I encountered an error. Please check your API key in Settings." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gradient flex items-center gap-3">
             AI Coach <Sparkles className="text-primary-start animate-pulse" size={32} />
          </h1>
          <p className="text-gray-500 font-medium">Your personal financial oracle</p>
        </div>
      </header>

      <div className="flex-1 glass rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-start/10 to-transparent pointer-events-none" />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar relative z-10">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-8"
              >
                <div className="w-24 h-24 bg-primary-start/10 rounded-full flex items-center justify-center">
                   <Bot size={48} className="text-primary-start" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                   <p className="text-gray-500 text-sm max-w-xs mx-auto">Ask me about your spending patterns, savings goals, or ways to improve your financial health.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                   {STARTER_SUGGESTIONS.map(s => (
                      <button 
                        key={s} 
                        onClick={() => handleSend(s)}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold hover:bg-primary-start/10 hover:border-primary-start/30 transition-all text-left flex items-center justify-between group"
                      >
                         {s} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                   ))}
                </div>
              </motion.div>
            )}

            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-6 rounded-3xl relative ${m.role === 'user' ? 'bg-gradient-to-br from-primary-start to-primary-end text-white rounded-tr-none shadow-xl shadow-primary-start/20' : 'glass-dark rounded-tl-none border border-white/10'}`}>
                   <p className="text-sm md:text-base font-medium leading-relaxed">{m.content}</p>
                   <span className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-4 block">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
             <div className="flex justify-start">
                <div className="glass-dark p-6 rounded-3xl rounded-tl-none flex items-center gap-3 border border-white/5">
                   <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-primary-start rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-primary-start rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-primary-start rounded-full" />
                   </div>
                </div>
             </div>
          )}
        </div>

        <form 
          onSubmit={e => { e.preventDefault(); handleSend(input); }} 
          className="p-6 border-t border-white/5 bg-[#030712]/50 backdrop-blur-2xl relative z-10"
        >
          <div className="relative group max-w-4xl mx-auto">
            <input 
              type="text"
              placeholder="Message your coach..."
              className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-8 pr-16 py-5 font-bold transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-br from-primary-start to-primary-end text-white rounded-2xl transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shadow-lg"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
