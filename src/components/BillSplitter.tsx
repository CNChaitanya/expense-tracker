import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Scissors, UserMinus, Plus, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '../lib/animations';
import { formatCurrency } from '../lib/currency';
import { playSound } from '../lib/sounds';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

export const BillSplitter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('exp-friends');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'custom'>('equal');
  
  const [step, setStep] = useState<'friends' | 'bill' | 'result'>('bill');
  const [newFriendName, setNewFriendName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('exp-friends', JSON.stringify(friends));
  }, [friends]);

  const addFriend = () => {
    if (!newFriendName.trim()) return;
    const newFriend: Friend = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFriendName,
      avatar: newFriendName[0].toUpperCase(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    setFriends([...friends, newFriend]);
    setNewFriendName('');
    playSound('add');
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter(f => f.id !== id));
    setSelectedFriends(selectedFriends.filter(fid => fid !== id));
  };

  const toggleFriendSelection = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(fid => fid !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const handleSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || selectedFriends.length === 0) return;
    setStep('result');
    playSound('success');
  };

  const totalSelected = selectedFriends.length + 1; // including self
  const perPerson = parseFloat(amount) / totalSelected;

  const copyPaymentLink = () => {
    const text = `Bill: ${billName}\nTotal: ₹${amount}\nYour share: ₹${formatCurrency(Math.round(perPerson * 100))}\nPlease pay to UPI: myupi@bank`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass w-full max-w-4xl min-h-[70vh] rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5"
      >
        {/* Left Side: Friends Management */}
        <div className="md:w-80 bg-white/[0.02] p-8 border-r border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-black uppercase tracking-tight">Friends</h2>
             <span className="bg-primary-start/20 text-primary-start px-2 py-1 rounded-lg text-[10px] font-black">{friends.length}</span>
          </div>

          <div className="space-y-4 mb-8">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="New friend name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs font-bold focus:border-primary-start outline-none transition-all"
                  value={newFriendName}
                  onChange={e => setNewFriendName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addFriend()}
                />
                <button onClick={addFriend} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-start hover:text-white p-1 bg-primary-start/10 rounded-lg transition-all">
                   <Plus size={16} />
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pr-2">
             {friends.map(f => (
                <div key={f.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${selectedFriends.includes(f.id) ? 'bg-primary-start/10 border-primary-start/30' : 'bg-white/5 border-transparent'}`}>
                   <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleFriendSelection(f.id)}>
                      <div className={`w-8 h-8 rounded-full ${f.color} flex items-center justify-center text-[10px] font-black text-white shadow-lg`}>{f.avatar}</div>
                      <span className="text-sm font-bold">{f.name}</span>
                   </div>
                   <button onClick={() => removeFriend(f.id)} className="p-1 text-gray-600 hover:text-red-500 transition-colors">
                      <UserMinus size={14} />
                   </button>
                </div>
             ))}
             {friends.length === 0 && (
                <p className="text-center py-10 text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">Add friends to <br />start splitting bills</p>
             )}
          </div>
        </div>

        {/* Right Side: Split Logic */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar relative">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"><X size={24} /></button>

          <AnimatePresence mode="wait">
             {step === 'bill' && (
                <motion.div 
                  key="bill"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                   <div>
                      <h2 className="text-4xl font-black text-gradient uppercase tracking-tight mb-2">Split Bill</h2>
                      <p className="text-gray-500 font-medium italic">Select friends from the left to include them in the split.</p>
                   </div>

                   <form onSubmit={handleSplit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bill Name</label>
                            <input 
                               type="text" 
                               required 
                               placeholder="e.g. Goa Trip Dinner"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary-start outline-none"
                               value={billName}
                               onChange={e => setBillName(e.target.value)}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Total Amount (₹)</label>
                            <input 
                               type="number" 
                               required 
                               placeholder="0.00"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black text-2xl focus:border-primary-start outline-none"
                               value={amount}
                               onChange={e => setAmount(e.target.value)}
                            />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Included in Split ({totalSelected} people)</label>
                         <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 p-2 bg-primary-start text-white rounded-xl text-xs font-black shadow-lg shadow-primary-start/20">
                               <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">Me</div>
                               <span>You</span>
                            </div>
                            {friends.filter(f => selectedFriends.includes(f.id)).map(f => (
                               <div key={f.id} className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold animate-in zoom-in duration-300">
                                  <div className={`w-6 h-6 ${f.color} rounded-lg flex items-center justify-center text-[10px] text-white`}>{f.avatar}</div>
                                  <span>{f.name}</span>
                               </div>
                            ))}
                            {selectedFriends.length === 0 && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-2"><Scissors size={12} /> Pick some friends to split!</p>}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Split Type</label>
                         <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 max-w-sm">
                            {(['equal', 'percentage', 'custom'] as const).map(t => (
                               <button 
                                 key={t}
                                 type="button"
                                 onClick={() => setSplitType(t)}
                                 className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${splitType === t ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                               >
                                  {t}
                               </button>
                            ))}
                         </div>
                      </div>

                      <button 
                         type="submit" 
                         disabled={selectedFriends.length === 0 || !amount}
                         className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/30 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all"
                      >
                         <Scissors size={20} /> Generate Split
                      </button>
                   </form>
                </motion.div>
             )}

             {step === 'result' && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                   <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-primary-start/10 rounded-[24px] flex items-center justify-center mx-auto shadow-inner">
                         <Landmark size={40} className="text-primary-start" />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-gradient uppercase tracking-tight">{billName || 'Split Summary'}</h2>
                         <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Bill: ₹{amount}</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-6 bg-primary-start text-white rounded-[32px] shadow-2xl shadow-primary-start/30">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black">Me</div>
                            <div>
                               <p className="text-[10px] font-black uppercase opacity-60">Your Share</p>
                               <p className="text-2xl font-black tabular-nums">₹{formatCurrency(Math.round(perPerson * 100))}</p>
                            </div>
                         </div>
                         <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Settled</div>
                      </div>

                      {friends.filter(f => selectedFriends.includes(f.id)).map(f => (
                         <div key={f.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-[32px] group">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-xl`}>{f.avatar}</div>
                               <div>
                                  <p className="text-[10px] font-black uppercase text-gray-500">{f.name}</p>
                                  <p className="text-2xl font-black tabular-nums text-white/90">₹{formatCurrency(Math.round(perPerson * 100))}</p>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button className="px-4 py-2 bg-white/5 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-gray-500">Settle</button>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                      <button 
                        onClick={copyPaymentLink}
                        className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl active:scale-95"
                      >
                         {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                         {copied ? 'Copied to Clipboard!' : 'Copy Payment Message'}
                      </button>
                      <button 
                        onClick={() => setStep('bill')}
                        className="w-full py-4 rounded-2xl font-black text-sm text-gray-500 hover:bg-white/5 transition-all"
                      >
                         Edit Split Details
                      </button>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
