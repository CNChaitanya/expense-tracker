import React, { useState, useEffect } from 'react';
import { Globe, ArrowRightLeft, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD', 'AED'];

export const CurrencyConverter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [amount, setAmount] = useState('1000');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      const cached = localStorage.getItem('fx_rates');
      const lastFetch = parseInt(localStorage.getItem('fx_rates_time') || '0', 10);
      
      if (cached && (Date.now() - lastFetch < 3600000)) {
        setRates(JSON.parse(cached));
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await res.json();
        setRates(data.rates);
        localStorage.setItem('fx_rates', JSON.stringify(data.rates));
        localStorage.setItem('fx_rates_time', Date.now().toString());
      } catch (e) {
        console.error('FX fetch failed', e);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchRates();
  }, [isOpen]);

  const converted = rates[selectedCurrency] ? (parseFloat(amount) * rates[selectedCurrency]).toFixed(2) : '0.00';

  return (
    <div className="fixed bottom-24 left-6 md:bottom-8 md:left-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-72 p-6 rounded-[24px] mb-4 shadow-2xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold flex items-center gap-2">
                  <Globe size={16} className="text-primary-start" /> FX Converter
               </h3>
               <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
            </div>

            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Amount (INR)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-bold focus:border-primary-start outline-none"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
               </div>

               <div className="flex items-center justify-center py-1">
                  <ArrowRightLeft size={16} className="text-gray-600 rotate-90" />
               </div>

               <div className="space-y-1">
                  <div className="flex justify-between">
                     <label className="text-[10px] font-black text-gray-500 uppercase">Target Currency</label>
                     {loading && <RefreshCw size={10} className="animate-spin text-primary-start" />}
                  </div>
                  <div className="flex gap-2">
                     <select 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-bold outline-none"
                        value={selectedCurrency}
                        onChange={e => setSelectedCurrency(e.target.value)}
                     >
                        {CURRENCIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                     </select>
                     <div className="flex-[1.5] bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-black text-gradient flex items-center justify-end">
                        {converted}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'bg-primary-start text-white' : 'glass text-gray-400 hover:text-white'}`}
      >
        <Globe size={24} />
      </button>
    </div>
  );
};
