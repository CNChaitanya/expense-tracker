import React, { useRef, useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { exportToCSV, exportToJSON } from '../lib/export';
import { parseCSV } from '../lib/import';
import { Download, Upload, Shield, Database, Trash2, Volume2, VolumeX, Settings as SettingsIcon, Palette, Zap } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useAppTheme } from '../store/ThemeContext';

export const Settings: React.FC = () => {
  const { expenses, categories, addExpense } = useExpenses();
  const { isAmoled, toggleAmoled } = useAppTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    setSoundEnabled(localStorage.getItem('sound_effects') === 'true');
  }, []);

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('sound_effects', String(newValue));
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
        alert(`Successfully imported ${importedData.length} transactions!`);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-black text-gradient">Settings</h1>
        <p className="text-gray-500 font-medium">Personalize your ExpTracker experience</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Visual Preferences */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-primary-start">
            <Palette size={24} />
            <h2 className="text-2xl font-bold">Aesthetics</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Color Theme</h3>
              <ThemeSelector />
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={toggleAmoled}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Zap size={20} className={isAmoled ? "text-yellow-400" : "text-gray-400"} />
                  <div className="text-left">
                    <p className="font-bold">AMOLED Mode</p>
                    <p className="text-xs text-gray-500">Pure black background for OLED screens</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isAmoled ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isAmoled ? 'left-6' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 text-primary-start">
              <Database size={24} />
              <h2 className="text-xl font-bold">Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => exportToCSV(expenses, categories)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-primary-start hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} />
                    <span className="font-medium">Export to CSV</span>
                  </div>
                </button>

                <button 
                  onClick={() => exportToJSON(expenses, categories)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-primary-start hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} />
                    <span className="font-medium">Export to JSON</span>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImport}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-primary-start hover:text-primary-start transition-all"
                >
                  <Upload size={20} />
                  <span className="font-medium">Import from CSV</span>
                </button>
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-3xl space-y-6 flex flex-col">
            <div className="flex items-center gap-3 text-primary-start">
              <SettingsIcon size={24} />
              <h2 className="text-xl font-bold">App Settings</h2>
            </div>
            
            <div className="space-y-4 flex-1">
              <button 
                onClick={toggleSound}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  <span className="font-medium">Sound Effects</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${soundEnabled ? 'left-6' : 'left-1'}`} />
                </div>
              </button>

              <div className="pt-4 mt-auto">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                  <Shield size={20} />
                  <span className="font-bold">Security</span>
                </div>
                <button 
                  className="w-full flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                  onClick={() => {
                    if(confirm('Are you sure? This will delete all local data!')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <Trash2 size={20} />
                  <span className="font-medium">Clear All Local Data</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
