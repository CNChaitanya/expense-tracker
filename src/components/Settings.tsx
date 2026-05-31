import React, { useRef } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { exportToCSV, exportToJSON } from '../lib/export';
import { parseCSV } from '../lib/import';
import { Download, Upload, Shield, Database, Trash2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { expenses, categories, addExpense } = useExpenses();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your data and preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass dark:glass-dark p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-accent">
            <Database size={24} />
            <h2 className="text-xl font-bold">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => exportToCSV(expenses, categories)}
                className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-accent hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download size={20} />
                  <span className="font-medium">Export to CSV</span>
                </div>
                <span className="text-xs opacity-50 group-hover:opacity-100">Download .csv</span>
              </button>

              <button 
                onClick={() => exportToJSON(expenses, categories)}
                className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-accent hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download size={20} />
                  <span className="font-medium">Export to JSON</span>
                </div>
                <span className="text-xs opacity-50 group-hover:opacity-100">Download .json</span>
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
                className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 hover:border-accent hover:text-accent transition-all"
              >
                <Upload size={20} />
                <span className="font-medium">Import from CSV</span>
              </button>
            </div>
          </div>
        </section>

        <section className="glass dark:glass-dark p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-accent">
            <Shield size={24} />
            <h2 className="text-xl font-bold">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <p className="text-sm text-gray-500 leading-relaxed">
                All your financial data is stored locally in an encrypted-at-rest SQLite database within your browser. 
                We never see your transactions.
              </p>
            </div>

            <button 
              className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
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
        </section>
      </div>
    </div>
  );
};
