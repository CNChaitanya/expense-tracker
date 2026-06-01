import React, { useState } from 'react';
import { useAppTheme } from '../store/ThemeContext';
import { ChevronRight, ChevronLeft, LayoutDashboard, Receipt, Wallet, Settings, Menu, X, Sun, Bot, Target, RefreshCw, Scissors, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from './visual/AuroraBackground';
import { CursorGlow } from './visual/CursorGlow';
import { useGamification } from '../hooks/useGamification';

export type Page = 'dash' | 'expenses' | 'budgets' | 'settings' | 'coach' | 'goals' | 'subscriptions' | 'splitter' | 'timeline';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! ☀️';
  if (hour < 18) return 'Good afternoon! 🌤️';
  return 'Good evening! 🌙';
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { isAmoled, toggleAmoled } = useAppTheme();
  const { level, levelName, progress } = useGamification();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('exp-sidebar-collapsed') !== 'true';
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('exp-sidebar-collapsed', String(!newState));
  };

  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt size={24} /> },
    { id: 'budgets', label: 'Budgets', icon: <Wallet size={24} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={24} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <RefreshCw size={24} /> },
    { id: 'splitter', label: 'Bill Splitter', icon: <Scissors size={24} /> },
    { id: 'coach', label: 'AI Coach', icon: <Bot size={24} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col md:flex-row relative">
      <AuroraBackground />
      <CursorGlow />
      
      {/* Floating Expand Button when collapsed */}
      {!isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-[60] bg-primary-start text-white p-2 rounded-r-xl shadow-xl hover:pl-4 transition-all group"
        >
          <ChevronRight size={20} className="group-hover:scale-125 transition-transform" />
        </button>
      )}

      {/* Mobile Header */}
      <div className="md:hidden glass p-4 flex justify-between items-center z-50 sticky top-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-start to-primary-end rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-start/30">
            <Wallet size={18} />
          </div>
          <span className="font-bold tracking-tight">ExpTracker</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-white/5">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className={`fixed md:sticky top-0 bottom-0 left-0 z-40 glass border-r border-white/10 md:h-screen md:py-8 md:px-4 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 md:w-16 md:translate-x-0'} md:translate-x-0 overflow-hidden shadow-2xl`}>
        <div className="flex flex-col gap-4 w-full h-full min-w-[200px]">
          <div className={`hidden md:flex items-center gap-3 px-4 mb-2 transition-all ${!isSidebarOpen ? 'justify-center px-0' : ''}`}>
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-primary-start to-primary-end rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-start/30">
              <Wallet size={24} />
            </div>
            {isSidebarOpen && (
              <div className="flex gap-0.5">
                {"ExpTracker".split("").map((l, i) => (
                   <span key={i} className="text-xl font-black tracking-tight bg-gradient-to-br from-primary-start to-primary-end bg-clip-text text-transparent uppercase inline-block" style={{ animation: `letter-float 3s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{l}</span>
                ))}
              </div>
            )}
          </div>

          {isSidebarOpen && (
            <div className="px-4 mb-6 md:block hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 opacity-50 mb-4">{getGreeting()}</p>
              
              {/* XP Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-primary-start uppercase tracking-tighter">{levelName}</span>
                  <span className="text-[10px] font-bold text-gray-500">LVL {level}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary-start to-primary-end shadow-[0_0_10px_rgba(var(--primary-glow),0.3)]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 space-y-1 mt-16 md:mt-0 px-2 overflow-y-auto no-scrollbar">
            {navItems.map(item => (
              <NavItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={currentPage === item.id || (item.id === 'expenses' && currentPage === 'timeline')} 
                onClick={() => { onPageChange(item.id as Page); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                expanded={isSidebarOpen}
              />
            ))}
          </div>

          <div className="space-y-2 px-2 pb-6 md:pb-0">
            <button 
              onClick={toggleAmoled}
              className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors w-full group ${!isSidebarOpen ? 'justify-center' : ''}`}
            >
              <div className="shrink-0 text-gray-500 group-hover:text-white">
                {isAmoled ? <Sun size={24} /> : <Moon size={24} />}
              </div>
              {isSidebarOpen && <span className="font-bold whitespace-nowrap text-gray-500 group-hover:text-white">{isAmoled ? 'Light Mode' : 'AMOLED Mode'}</span>}
            </button>
            <button 
              onClick={toggleSidebar}
              className={`hidden md:flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors w-full group ${!isSidebarOpen ? 'justify-center' : ''}`}
            >
               <div className="shrink-0 text-gray-500 group-hover:text-white">
                  {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
               </div>
               {isSidebarOpen && <span className="font-bold whitespace-nowrap text-gray-500 group-hover:text-white">Collapse</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 lg:p-12 w-full max-w-full overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; expanded: boolean }> = ({ icon, label, active, onClick, expanded }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-3 rounded-2xl group transition-all w-full relative overflow-hidden ${!expanded ? 'justify-center' : ''} ${active ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/20" />
    )}
    {active && expanded && (
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
    )}
    <span className="shrink-0 relative z-10">{icon}</span>
    {expanded && <span className="text-sm font-black tracking-wide whitespace-nowrap relative z-10">{label}</span>}
  </button>
);
