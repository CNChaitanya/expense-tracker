import React, { useRef, useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { exportToCSV, exportToJSON } from '../lib/export';
import { parseCSV } from '../lib/import';
import { Download, Upload, Database, Trash2, Volume2, VolumeX, Settings as SettingsIcon, Palette, Zap, FileText, Sparkles, LogOut, Key } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useAppTheme } from '../store/ThemeContext';
import { BankImport } from './BankImport';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '../hooks/useNotification';

export const Settings: React.FC = () => {
  const { expenses, categories, addExpense } = useExpenses();
  const { isAmoled, toggleAmoled } = useAppTheme();
  const { addToast } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showBankImport, setShowBankImport] = useState(false);

  useEffect(() => {
    setSoundEnabled(localStorage.getItem('sound_effects') === 'true');
  }, []);

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('sound_effects', String(newValue));
  };

  const handleLogout = () => {
    localStorage.removeItem('exp-auth-user');
    window.location.href = '/login';
  };

  const handleSaveApiKey = () => {
    const key = (document.getElementById('anthropic-key') as HTMLInputElement).value;
    localStorage.setItem('exp-anthropic-key', key);
    addToast("API Key saved!", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const importedData = parseCSV(text, categories);
        for (const item of importedData) {
          if (item) {
            await addExpense(item);
          }
        }
        addToast(`Successfully imported ${importedData.length} transactions!`, "success");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <header>
        <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Settings</h1>
        <p className="text-gray-500 font-medium">Personalize your ExpTracker experience</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Visual Preferences */}
        <section className="glass p-8 rounded-[40px] space-y-8 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary-start">
            <Palette size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight">Aesthetics</h2>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Global Theme</h3>
              <ThemeSelector />
            </div>

            <div className="pt-8 border-t border-white/5">
              <button 
                onClick={toggleAmoled}
                className="w-full flex items-center justify-between p-6 bg-white/5 rounded-[28px] hover:bg-white/10 transition-all group border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isAmoled ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-400'}`}>
                    <Zap size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg">AMOLED Mode</p>
                    <p className="text-xs text-gray-500 font-medium">Pure black background for OLED screens</p>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors ${isAmoled ? 'bg-primary-start' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-lg ${isAmoled ? 'left-8' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass p-8 rounded-[40px] space-y-8 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 text-primary-start">
              <Database size={24} />
              <h2 className="text-2xl font-black uppercase tracking-tight">Data</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <button 
                   onClick={() => setShowBankImport(true)}
                   className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-primary-start/10 to-transparent border border-primary-start/20 rounded-[28px] hover:from-primary-start/20 transition-all group shadow-xl"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-start/20 rounded-xl">
                         <FileText size={20} className="text-primary-start" />
                      </div>
                      <span className="font-black text-primary-start uppercase tracking-widest text-sm">Bank / UPI Import</span>
                   </div>
                   <Sparkles size={20} className="text-primary-start animate-pulse" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => exportToCSV(expenses, categories)}
                     className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[28px] hover:bg-primary-start hover:text-white transition-all group border border-white/5"
                   >
                      <Download size={24} />
                      <span className="font-black uppercase text-[10px] tracking-widest text-gray-500 group-hover:text-white">Export CSV</span>
                   </button>

                   <button 
                     onClick={() => exportToJSON(expenses, categories)}
                     className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[28px] hover:bg-primary-start hover:text-white transition-all group border border-white/5"
                   >
                      <Download size={24} />
                      <span className="font-black uppercase text-[10px] tracking-widest text-gray-500 group-hover:text-white">Export JSON</span>
                   </button>
                </div>
              </div>

              <div className="pt-4">
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImport}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-[28px] text-gray-500 hover:border-primary-start hover:text-primary-start transition-all font-black uppercase text-xs tracking-widest"
                >
                  <Upload size={20} />
                  Import from CSV
                </button>
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-[40px] space-y-8 border border-white/5 shadow-2xl flex flex-col">
            <div className="flex items-center gap-3 text-primary-start">
              <SettingsIcon size={24} />
              <h2 className="text-2xl font-black uppercase tracking-tight">System</h2>
            </div>
            
            <div className="space-y-6 flex-1 flex flex-col">
              <button 
                onClick={toggleSound}
                className="w-full flex items-center justify-between p-6 bg-white/5 rounded-[28px] hover:bg-white/10 transition-all group border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${soundEnabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-400'}`}>
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </div>
                  <span className="font-black text-lg">Sound Effects</span>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors ${soundEnabled ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-lg ${soundEnabled ? 'left-8' : 'left-1'}`} />
                </div>
              </button>

              <div className="p-6 bg-white/5 rounded-[28px] border border-white/5 space-y-4">
                 <div className="flex items-center gap-3 text-indigo-400">
                    <Key size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Coach API Key</span>
                 </div>
                 <div className="flex gap-2">
                    <input 
                      id="anthropic-key"
                      type="password"
                      placeholder="sk-ant-..."
                      defaultValue={localStorage.getItem('exp-anthropic-key') || ''}
                      className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-3 font-bold text-sm focus:border-primary-start outline-none"
                    />
                    <button onClick={handleSaveApiKey} className="px-5 py-3 bg-primary-start rounded-2xl text-white font-black text-xs hover:bg-primary-end transition-all shadow-lg">Save</button>
                 </div>
              </div>

              <div className="pt-8 mt-auto space-y-4">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-5 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 rounded-[28px] transition-all border border-white/5 font-black uppercase text-xs tracking-[0.2em]"
                >
                  <LogOut size={18} /> Logout Session
                </button>
                
                <button 
                  className="w-full flex items-center justify-center gap-3 p-5 bg-red-500/5 text-red-900 dark:text-red-500/40 rounded-[28px] hover:bg-red-500 hover:text-white transition-all border border-red-500/10 font-black uppercase text-[10px] tracking-widest"
                  onClick={() => {
                    if(confirm('Are you sure? This will delete ALL local data forever!')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <Trash2 size={16} />
                  Wipe Local Database
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
         {showBankImport && <BankImport onClose={() => setShowBankImport(false)} />}
      </AnimatePresence>
    </div>
  );
};
