import React, { useState } from 'react';
import { FileText, X, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { modalVariants } from '../lib/animations';
import { playSound } from '../lib/sounds';
import { triggerConfetti } from '../lib/confetti';
import { useExpenses } from '../hooks/useExpenses';

export const BankImport: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [parsed, setParsed] = useState<any[]>([]);
  const { categories, addExpense } = useExpenses();

  const handleParse = () => {
    const amountRegex = /(?:rs|inr|amt|spent|paid)\.?\s*(\d+(?:\.\d{1,2})?)/gi;
    const merchants = ['Amazon', 'Uber', 'Zomato', 'Swiggy', 'Starbucks', 'Netflix', 'Rent', 'Electricity'];
    
    const lines = text.split('\n');
    const results: any[] = [];

    lines.forEach(line => {
      const match = amountRegex.exec(line);
      if (match) {
        const amount = parseFloat(match[1]);
        const merchant = merchants.find(m => line.toLowerCase().includes(m.toLowerCase())) || 'Other Merchant';
        
        let cat = categories[0];
        if (line.toLowerCase().includes('uber')) cat = categories.find(c => c.name === 'Transport') || cat;
        if (line.toLowerCase().includes('amazon')) cat = categories.find(c => c.name === 'Shopping') || cat;
        if (line.toLowerCase().includes('food') || line.toLowerCase().includes('zomato')) cat = categories.find(c => c.name === 'Food') || cat;

        results.push({
          amount: Math.round(amount * 100),
          note: `Imported: ${merchant}`,
          categoryId: cat.id,
          categoryName: cat.name,
          date: new Date(),
          paymentMethod: 'upi',
          type: 'expense'
        });
      }
    });

    setParsed(results);
    setStep('preview');
  };

  const handleImport = async () => {
    for (const item of parsed) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categoryName: _, ...rest } = item;
      await addExpense(rest);
    }
    triggerConfetti();
    playSound('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250] flex items-center justify-center p-4">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass max-w-2xl w-full p-8 rounded-[32px] space-y-6 relative overflow-hidden"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black flex items-center gap-3">
            Bank Import <FileText className="text-primary-start" />
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
        </div>

        {step === 'input' ? (
          <div className="space-y-6">
            <div className="p-4 bg-primary-start/5 border border-primary-start/10 rounded-2xl text-sm text-gray-400">
               Paste your bank statement text or UPI message below. Our AI will automatically extract transactions.
            </div>
            <textarea 
              className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-medium focus:border-primary-start outline-none resize-none"
              placeholder="Example: Your a/c no. XX1234 is debited for Rs. 500.00 on 31-05-26 by info Swiggy..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button 
              onClick={handleParse}
              disabled={!text.trim()}
              className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <Sparkles size={18} /> Analyze Statement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="max-h-80 overflow-y-auto space-y-2 pr-2 no-scrollbar">
                {parsed.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex flex-col">
                       <span className="font-bold text-sm">{item.note}</span>
                       <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{item.categoryName}</span>
                    </div>
                    <span className="font-black text-red-500">₹{(item.amount / 100).toFixed(2)}</span>
                  </div>
                ))}
             </div>
             
             <div className="flex gap-4">
                <button 
                  onClick={() => setStep('input')}
                  className="px-6 py-4 rounded-2xl font-black text-sm text-gray-500 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleImport}
                  className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Check size={18} /> Confirm Import ({parsed.length})
                </button>
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
