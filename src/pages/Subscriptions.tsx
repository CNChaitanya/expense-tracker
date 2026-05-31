import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Bell, Trash2, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrizzleDb, saveDb } from '../db/client';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../lib/currency';
import { playSound } from '../lib/sounds';

const SUBSCRIPTION_EMOJIS = ['🎬', '🎵', '🎮', '📱', '🏋️', '☁️', '📰', '🛒', '🍔', '🏥'];

export const SubscriptionTracker: React.FC = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', amount: '', interval: 'monthly' as 'monthly' | 'yearly', emoji: '🎬' });

  const fetchSubs = useCallback(async () => {
    try {
      const db = getDrizzleDb();
      const all = db.select().from(schema.subscriptions).all();
      setSubs(all);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.name || !newSub.amount) return;

    const db = getDrizzleDb();
    await db.insert(schema.subscriptions).values({
      id: uuidv4(),
      name: newSub.name,
      amount: Math.round(parseFloat(newSub.amount) * 100),
      interval: newSub.interval,
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      emoji: newSub.emoji,
      createdAt: new Date(),
    }).run();
    await saveDb();
    setShowAdd(false);
    setNewSub({ name: '', amount: '', interval: 'monthly', emoji: '🎬' });
    fetchSubs();
    playSound('add');
  };

  const deleteSub = async (id: string) => {
    if (!confirm('Cancel this subscription?')) return;
    const db = getDrizzleDb();
    await db.delete(schema.subscriptions).where(eq(schema.subscriptions.id, id)).run();
    await saveDb();
    fetchSubs();
    playSound('delete');
  };

  const totalMonthly = subs.reduce((sum, s) => {
    const monthly = s.interval === 'monthly' ? s.amount : s.amount / 12;
    return sum + monthly;
  }, 0);

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gradient flex items-center gap-3 uppercase">
            Subscriptions <RefreshCw className="text-primary-start" />
          </h1>
          <p className="text-gray-500 font-medium">Keep track of your monthly & yearly recurring costs</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-4 bg-primary-start hover:bg-primary-end text-white rounded-2xl shadow-lg transition-all"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="glass p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 border border-white/10">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-3xl">
               <Zap className="text-indigo-400" size={32} />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-gray-500">Monthly Burn Rate</p>
               <h2 className="text-4xl font-black">₹{formatCurrency(totalMonthly)}</h2>
            </div>
         </div>
         {totalMonthly > 500000 && (
            <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-2 animate-pulse">
               <Bell size={18} /> Subscription Creep Alert!
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subs.map(sub => (
          <motion.div 
            key={sub.id} 
            layoutId={sub.id}
            className="glass p-6 rounded-[32px] space-y-4 border border-white/5 card-hover group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
               <div className="text-4xl">{sub.emoji}</div>
               <button onClick={() => deleteSub(sub.id)} className="p-2 opacity-0 group-hover:opacity-100 transition-all text-gray-500 hover:text-red-500">
                  <Trash2 size={16} />
               </button>
            </div>
            
            <div>
               <h3 className="text-xl font-bold">{sub.name}</h3>
               <p className="text-2xl font-black text-white/90 tabular-nums">₹{formatCurrency(sub.amount)}<span className="text-xs text-gray-500 font-bold uppercase ml-1">/{sub.interval.replace('ly', '')}</span></p>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
               <span>Next: {new Date(sub.nextBilling).toLocaleDateString()}</span>
               <div className="px-2 py-1 bg-white/5 rounded-lg text-primary-start">
                  {sub.interval}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full p-8 rounded-[32px] space-y-6 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gradient">New Subscription</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="flex justify-between mb-4">
                   {SUBSCRIPTION_EMOJIS.map(e => (
                      <button 
                        key={e} 
                        type="button" 
                        onClick={() => setNewSub({ ...newSub, emoji: e })}
                        className={`text-2xl p-2 rounded-xl transition-all ${newSub.emoji === e ? 'bg-primary-start/20 scale-125' : 'opacity-40 hover:opacity-100'}`}
                      >
                         {e}
                      </button>
                   ))}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Service Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Netflix" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start outline-none transition-all"
                    value={newSub.name}
                    onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="0.00" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start outline-none transition-all"
                      value={newSub.amount}
                      onChange={e => setNewSub({ ...newSub, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Billing</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start outline-none transition-all appearance-none"
                      value={newSub.interval}
                      onChange={e => setNewSub({ ...newSub, interval: e.target.value as any })}
                    >
                      <option value="monthly" className="bg-gray-900">Monthly</option>
                      <option value="yearly" className="bg-gray-900">Yearly</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/20 mt-4 transition-all">
                  Add Subscription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
