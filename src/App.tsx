import { useState, useEffect } from 'react';
import { ThemeProvider } from './store/ThemeContext';
import { Layout } from './components/Layout';
import type { Page } from './components/Layout';
import { useDatabase } from './hooks/useDatabase';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SummaryCards } from './components/SummaryCards';
import { CategoryChart } from './components/CategoryChart';
import { BudgetMonitor } from './components/BudgetMonitor';
import { TrendChart } from './components/TrendChart';
import { Settings } from './components/Settings';
import { Plus, Clock, ChevronRight } from 'lucide-react';
import { DashboardSkeleton } from './components/Skeleton';
import { useNotifications } from './hooks/useNotification';
import { ToastContainer } from './components/ToastContainer';
import { ExpenseHeatmap } from './components/ExpenseHeatmap';
import { StreakCounter } from './components/StreakCounter';
import { SmartInsights } from './components/SmartInsights';
import { MonthlyReportCard } from './components/MonthlyReportCard';
import { GlobalSearch } from './components/GlobalSearch';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { AICoach } from './components/AICoach';
import { SavingsGoals } from './pages/SavingsGoals';
import { FinancialHealthScore } from './components/FinancialHealthScore';
import { SubscriptionTracker } from './pages/Subscriptions';
import { BillSplitter } from './components/BillSplitter';
import { FinancialCalendar } from './pages/FinancialCalendar';
import { TransactionTimeline } from './pages/TransactionTimeline';
import { CurrencyConverter } from './components/CurrencyConverter';
import { Login } from './pages/Login';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard() {
  const { expenses } = useExpenses();

  const totals = expenses.reduce((acc, curr) => {
    if (curr.type === 'expense') acc.spent += curr.amount;
    else acc.income += curr.amount;
    return acc;
  }, { spent: 0, income: 0 });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
             <div className="flex gap-1">
                {"DASHBOARD".split("").map((l, i) => (
                   <span key={i} className="text-4xl font-black text-gradient inline-block" style={{ animation: `letter-float 3s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>{l}</span>
                ))}
             </div>
             <StreakCounter />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 opacity-50 ml-1">Overview of your financial universe</p>
        </div>
        <div className="glass px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5 shadow-xl">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 float-slow-animation" style={{ animationDelay: '0s' }}>
           <SmartInsights />
           <SummaryCards spent={totals.spent} income={totals.income} />
        </div>
        <div className="space-y-8 float-slow-animation" style={{ animationDelay: '0.5s' }}>
           <FinancialHealthScore />
           <MonthlyReportCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="float-slow-animation" style={{ animationDelay: '1s' }}>
           <TrendChart />
        </div>
        <div className="grid grid-cols-1 gap-8 float-slow-animation" style={{ animationDelay: '1.5s' }}>
           <CategoryChart />
           <BudgetMonitor />
        </div>
      </div>

      <div className="float-slow-animation" style={{ animationDelay: '2s' }}>
         <ExpenseHeatmap />
      </div>

      <div className="flex justify-between items-center px-2">
         <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            Recent Activity <ChevronRight className="text-primary-start" />
         </h2>
      </div>
      <ExpenseList />
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dash');
  const [showForm, setShowForm] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const { isReady, error } = useDatabase();
  const { toasts } = useNotifications();

  useEffect(() => {
    const user = localStorage.getItem('exp-auth-user');
    setIsAuthenticated(!!user);
  }, []);

  useGlobalShortcuts(
    () => { setEditExpenseId(null); setShowForm(true); },
    () => setShowSearch(true),
    (page) => setCurrentPage(page as Page),
    () => { setShowForm(false); setShowSearch(false); setEditExpenseId(null); }
  );

  const handleEditExpense = (id: string) => {
    setEditExpenseId(id);
    setShowForm(true);
  };

  if (isAuthenticated === false) {
    return <Login />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold p-8 text-center bg-[#030712]">
        Error initializing database: {error.message}
      </div>
    );
  }

  if (!isReady || isAuthenticated === null) {
    return (
      <div className="bg-[#030712] min-h-screen">
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          <DashboardSkeleton />
        </Layout>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dash': return <Dashboard />;
      case 'expenses': return (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Transactions</h1>
              <div className="flex gap-2 glass p-1 rounded-xl border border-white/5">
                 <button onClick={() => setCurrentPage('expenses')} className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'expenses' ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>List</button>
                 <button onClick={() => setCurrentPage('timeline')} className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${(currentPage as string) === 'timeline' ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Timeline</button>
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                 <ExpenseList onEdit={handleEditExpense} />
              </div>
              <div className="space-y-6">
                 <button 
                  onClick={() => setCurrentPage('splitter')}
                  className="w-full glass p-8 rounded-[32px] flex flex-col items-center gap-4 border border-white/5 hover:border-primary-start/50 transition-all group shadow-2xl card-hover"
                 >
                    <div className="p-4 bg-primary-start/10 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                       <Plus className="text-primary-start rotate-45" size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Bill Splitter</span>
                 </button>
              </div>
           </div>
        </div>
      );
      case 'timeline': return <TransactionTimeline />;
      case 'budgets': return (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Financial Hub</h1>
              <div className="flex gap-2">
                 <button onClick={() => setCurrentPage('subscriptions')} className="px-6 py-3 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-start hover:bg-primary-start hover:text-white transition-all shadow-xl">Subscriptions</button>
                 <button onClick={() => setCurrentPage('coach')} className="px-6 py-3 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-start hover:bg-primary-start hover:text-white transition-all shadow-xl">AI Coach</button>
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <BudgetMonitor />
                 <FinancialCalendar />
              </div>
              <div className="space-y-8">
                 <FinancialHealthScore />
                 <ExpenseHeatmap />
              </div>
           </div>
        </div>
      );
      case 'settings': return <Settings />;
      case 'coach': return <AICoach />;
      case 'goals': return <SavingsGoals />;
      case 'subscriptions': return <SubscriptionTracker />;
      case 'splitter': return <BillSplitter onClose={() => setCurrentPage('expenses')} />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={['subscriptions', 'coach'].includes(currentPage) ? 'budgets' : currentPage === 'splitter' || currentPage === 'timeline' ? 'expenses' : currentPage} onPageChange={setCurrentPage}>
      <ToastContainer toasts={toasts} />
      <AnimatePresence mode="wait">
         <motion.div 
           key={currentPage}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.4 }}
           className="h-full"
         >
            {renderPage()}
         </motion.div>
      </AnimatePresence>

      <CurrencyConverter />

      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 flex flex-col gap-5 z-40">
         <button 
           onClick={() => setCurrentPage('timeline')}
           className="p-5 bg-white/5 glass rounded-[24px] text-gray-400 hover:text-white transition-all shadow-2xl border border-white/10 card-hover"
           title="Timeline"
         >
            <Clock size={24} />
         </button>
         <button 
           onClick={() => { setEditExpenseId(null); setShowForm(true); }}
           className="bg-gradient-to-br from-primary-start via-primary-end to-indigo-600 text-white p-7 rounded-full shadow-[0_0_50px_rgba(var(--primary-glow),0.5)] transition-all hover:scale-110 active:scale-95 group float-animation"
         >
           <Plus size={40} strokeWidth={3} className={`transition-transform duration-500 ${showForm ? 'rotate-45' : ''}`} />
         </button>
      </div>

      <AnimatePresence>
         {showForm && (
           <ExpenseForm 
             onClose={() => { setShowForm(false); setEditExpenseId(null); }} 
             editExpenseId={editExpenseId} 
           />
         )}
         {showSearch && (
           <GlobalSearch 
             onClose={() => setShowSearch(false)} 
             onNavigate={(p) => setCurrentPage(p as Page)} 
           />
         )}
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
