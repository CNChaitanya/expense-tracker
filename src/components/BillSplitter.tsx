import React, { useState } from 'react';
import { Users, X, Copy, Check, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { modalVariants } from '../lib/animations';
import { formatCurrency } from '../lib/currency';
import { playSound } from '../lib/sounds';

export const BillSplitter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [people, setPeople] = useState('2');
  const [isSplit, setIsSplit] = useState(false);
  const [copied, setCopied] = useState(false);

  const perPerson = isSplit ? Math.round((parseFloat(amount) * 100) / parseInt(people)) : 0;

  const handleSplit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSplit(true);
    playSound('success');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Hey! Each person owes ₹${formatCurrency(perPerson)} for the bill.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250] flex items-center justify-center p-4">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass max-w-md w-full p-8 rounded-[32px] space-y-6 relative overflow-hidden shadow-2xl"
      >
        {!isSplit ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black flex items-center gap-3">
                Split Bill <Users className="text-primary-start" />
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSplit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Total Bill Amount (₹)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="0.00" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-black focus:border-primary-start transition-all outline-none"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Number of People</label>
                <input 
                  type="number" 
                  required 
                  min="2"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start transition-all outline-none"
                  value={people}
                  onChange={e => setPeople(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/20 flex items-center justify-center gap-2 transition-all">
                <Scissors size={18} /> Split It!
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-primary-start/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-start" size={40} />
             </div>
             <div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Each Person Owes</p>
                <h2 className="text-5xl font-black text-gradient">₹{formatCurrency(perPerson)}</h2>
             </div>

             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-gray-400">
                Split of ₹{amount} among {people} people.
             </div>

             <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Share'}
                </button>
                <button 
                  onClick={() => setIsSplit(false)}
                  className="px-6 py-4 rounded-2xl font-black text-sm text-gray-500 hover:bg-white/5 transition-all"
                >
                  Edit
                </button>
             </div>
             <button onClick={onClose} className="text-xs font-black uppercase tracking-widest text-primary-start hover:underline block w-full mt-4">Done</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
