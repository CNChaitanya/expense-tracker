import React from 'react';
import { useTheme } from '../store/ThemeContext';
import { Sun, Moon, LayoutDashboard, Receipt, Wallet, Settings } from 'lucide-react';

export type Page = 'dash' | 'expenses' | 'budgets' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col md:flex-row">
      <nav className="fixed bottom-0 left-0 right-0 glass dark:glass-dark border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 md:sticky md:top-0 md:flex-col md:w-64 md:h-screen md:border-r md:border-t-0 md:py-8 md:px-4">
        <div className="flex md:flex-col items-center md:items-stretch gap-8 md:gap-4 w-full">
          <div className="hidden md:flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">ExpTracker</span>
          </div>

          <NavItem 
            icon={<LayoutDashboard size={24} />} 
            label="Dashboard" 
            active={currentPage === 'dash'} 
            onClick={() => onPageChange('dash')}
          />
          <NavItem 
            icon={<Receipt size={24} />} 
            label="Expenses" 
            active={currentPage === 'expenses'} 
            onClick={() => onPageChange('expenses')}
          />
          <NavItem 
            icon={<Wallet size={24} />} 
            label="Budgets" 
            active={currentPage === 'budgets'} 
            onClick={() => onPageChange('budgets')}
          />
          <NavItem 
            icon={<Settings size={24} />} 
            label="Settings" 
            active={currentPage === 'settings'} 
            onClick={() => onPageChange('settings')}
          />
        </div>
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 md:w-full md:mt-auto"
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          <span className="hidden md:inline font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </nav>

      <main className="flex-1 pb-24 md:pb-8 p-6 lg:p-10 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 p-2 md:px-4 md:py-3 rounded-2xl group transition-all w-full ${active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'}`}
  >
    <span className="shrink-0">{icon}</span>
    <span className="text-[10px] md:text-sm font-semibold tracking-wide">{label}</span>
  </button>
);
