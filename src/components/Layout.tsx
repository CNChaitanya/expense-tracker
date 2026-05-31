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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <nav className="fixed bottom-0 left-0 right-0 glass dark:glass-dark border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:flex-col md:left-0 md:w-20 md:h-screen md:border-r md:border-t-0">
        <div className="flex md:flex-col items-center gap-8">
          <NavItem 
            icon={<LayoutDashboard size={24} />} 
            label="Dash" 
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
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </nav>

      <main className="pb-24 md:pb-8 md:pl-24 p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 group transition-colors ${active ? 'text-accent' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
  >
    {icon}
    <span className="text-[10px] font-medium md:hidden">{label}</span>
  </button>
);
