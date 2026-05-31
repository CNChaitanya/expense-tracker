import React from 'react';
import { useAppTheme } from '../store/ThemeContext';
import type { AppTheme } from '../store/ThemeContext';
import { Check } from 'lucide-react';

const THEMES: { id: AppTheme; name: string; colors: string[] }[] = [
  { id: 'cosmic', name: 'Cosmic', colors: ['#6366f1', '#a855f7'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0ea5e9', '#2dd4bf'] },
  { id: 'sunset', name: 'Sunset', colors: ['#f43f5e', '#fb923c'] },
  { id: 'forest', name: 'Forest', colors: ['#10b981', '#84cc16'] },
  { id: 'inferno', name: 'Inferno', colors: ['#ef4444', '#f59e0b'] },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useAppTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`relative p-4 rounded-2xl border-2 transition-all group overflow-hidden ${
            theme === t.id 
              ? 'border-primary-start bg-white/5 shadow-lg shadow-primary-start/10' 
              : 'border-transparent bg-gray-100/5 hover:bg-white/5'
          }`}
        >
          {/* Preview Background */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br" 
               style={{ backgroundImage: `linear-gradient(to bottom right, ${t.colors[0]}, ${t.colors[1]})` }} />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full shadow-sm" 
                style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }} 
              />
              <span className="font-bold">{t.name}</span>
            </div>
            {theme === t.id && (
              <div className="w-6 h-6 rounded-full bg-primary-start flex items-center justify-center text-white">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
