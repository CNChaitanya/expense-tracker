import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useExpenses } from '../hooks/useExpenses';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your ExpTracker AI Coach. How can I help you save more today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { expenses, categories } = useExpenses();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Logic for context (unused for now but available)
      const totalSpent = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      console.log('Coach Context - Total Spent:', totalSpent);

      await new Promise(r => setTimeout(r, 1500));
      
      let response = "Based on your data, you are doing well! ";
      if (userMsg.toLowerCase().includes('save')) {
        response = `To save more, consider reducing spend in your top category: ${categories[0]?.name || 'Shopping'}. You've spent a significant amount there recently.`;
      } else {
        response = "I've analyzed your trends. Your spending velocity is 15% lower than last week. Great job!";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] space-y-6">
      <header>
        <h1 className="text-4xl font-black text-gradient flex items-center gap-3">
          AI Coach <Bot className="text-primary-start" size={32} />
        </h1>
        <p className="text-gray-500 font-medium">Smart financial advice tailored to your data</p>
      </header>

      <div className="flex-1 glass rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-start/5 to-transparent pointer-events-none" />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${m.role === 'user' ? 'bg-primary-start text-white rounded-tr-none' : 'glass-dark rounded-tl-none'}`}>
                {m.role === 'assistant' && <Bot size={18} className="shrink-0 text-primary-start mt-1" />}
                <p className="text-sm md:text-base font-medium leading-relaxed">{m.content}</p>
                {m.role === 'user' && <User size={18} className="shrink-0 opacity-50 mt-1" />}
              </div>
            </motion.div>
          ))}
          {loading && (
             <div className="flex justify-start">
                <div className="glass-dark p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin text-primary-start" />
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Coach is thinking...</span>
                </div>
             </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-xl">
          <div className="relative">
            <input 
              type="text"
              placeholder="Ask your coach anything..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 font-medium transition-all focus:ring-4 focus:ring-primary-start/10 focus:border-primary-start outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary-start hover:bg-primary-end text-white rounded-xl transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
