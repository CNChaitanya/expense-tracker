import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, TrendingUp, Trash2, Trophy, Coins, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrizzleDb, saveDb } from '../db/client';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../lib/currency';
import { triggerConfetti } from '../lib/confetti';
import { playSound } from '../lib/sounds';

export const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });

  const fetchGoals = useCallback(async () => {
    try {
      const db = getDrizzleDb();
      const all = db.select().from(schema.savingsGoals).all();
      setGoals(all);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    const db = getDrizzleDb();
    await db.insert(schema.savingsGoals).values({
      id: uuidv4(),
      name: newGoal.name,
      targetAmount: Math.round(parseFloat(newGoal.target) * 100),
      currentAmount: 0,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : null,
      createdAt: new Date(),
    }).run();
    await saveDb();
    setShowAdd(false);
    setNewGoal({ name: '', target: '', deadline: '' });
    fetchGoals();
    playSound('add');
  };

  const addMoney = async (id: string, amountInCents: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newAmount = goal.currentAmount + amountInCents;
    const db = getDrizzleDb();
    await db.update(schema.savingsGoals)
      .set({ currentAmount: newAmount })
      .where(eq(schema.savingsGoals.id, id))
      .run();
    await saveDb();
    
    if (newAmount >= goal.targetAmount) {
      triggerConfetti();
      playSound('success');
    } else {
      playSound('add');
    }
    fetchGoals();
  };

  const deleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    const db = getDrizzleDb();
    await db.delete(schema.savingsGoals).where(eq(schema.savingsGoals.id, id)).run();
    await saveDb();
    fetchGoals();
    playSound('delete');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gradient flex items-center gap-3">
            Savings Goals <Target className="text-primary-start" />
          </h1>
          <p className="text-gray-500 font-medium">Turning dreams into reality, one rupee at a time</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-4 bg-primary-start hover:bg-primary-end text-white rounded-2xl shadow-lg transition-all"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const remaining = goal.targetAmount - goal.currentAmount;
          
          return (
            <motion.div 
              key={goal.id} 
              layoutId={goal.id}
              className="glass p-6 rounded-[32px] space-y-6 relative overflow-hidden group border border-white/10"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-2xl">
                  {progress >= 100 ? <Trophy className="text-yellow-400" /> : <TrendingUp className="text-primary-start" />}
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="p-2 opacity-0 group-hover:opacity-100 transition-all text-gray-500 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold">{goal.name}</h3>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">
                  ₹{formatCurrency(goal.currentAmount)} of ₹{formatCurrency(goal.targetAmount)}
                </p>
              </div>

              <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full ${progress >= 100 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-primary-start to-primary-end'}`}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-[10px] font-bold text-gray-500 uppercase">
                  {progress >= 100 ? 'Goal Reached! 🎉' : `₹${formatCurrency(remaining)} to go`}
                </div>
                <button 
                  onClick={() => addMoney(goal.id, 50000)}
                  className="px-4 py-2 bg-white/5 hover:bg-primary-start hover:text-white rounded-xl text-xs font-black transition-all"
                >
                  Add ₹500
                </button>
              </div>
            </motion.div>
          );
        })}

        {goals.length === 0 && (
           <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-50">
              <Coins size={64} className="text-gray-700" />
              <p className="font-bold text-gray-600">No savings goals yet. Start small, dream big!</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full p-8 rounded-[32px] space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gradient">New Savings Goal</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Goal Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. New Macbook" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start transition-all outline-none"
                    value={newGoal.name}
                    onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Target Amount (₹)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="0.00" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start transition-all outline-none"
                    value={newGoal.target}
                    onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Deadline (Optional)</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start transition-all outline-none"
                    value={newGoal.deadline}
                    onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/20 mt-4 transition-all">
                  Create Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
