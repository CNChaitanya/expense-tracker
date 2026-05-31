import { useState } from 'react';
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
import { Plus, Clock } from 'lucide-react';
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

function Dashboard() {
  const { expenses } = useExpenses();

  const totals = expenses.reduce((acc, curr) => {
    if (curr.type === 'expense') acc.spent += curr.amount;
    else acc.income += curr.amount;
    return acc;
  }, { spent: 0, income: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-black text-gradient uppercase tracking-tight">Dashboard</h1>
          <StreakCounter />
        </div>
        <div className="glass px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <SmartInsights />
        </div>
        <FinancialHealthScore />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <SummaryCards spent={totals.spent} income={totals.income} />
        </div>
        <MonthlyReportCard />
      </div>

      <TrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <BudgetMonitor />
      </div>

      <ExpenseHeatmap />

      <div className="flex justify-between items-center px-1 pt-4">
         <h2 className="text-2xl font-black uppercase tracking-tight">Recent Activity</h2>
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
  const { isReady, error } = useDatabase();
  const { toasts } = useNotifications();

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

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold p-8 text-center bg-[#030712]">
        Error initializing database: {error.message}
      </div>
    );
  }

  if (!isReady) {
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
              <div className="flex gap-2 glass p-1 rounded-xl">
                 <button onClick={() => setCurrentPage('expenses')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${currentPage === 'expenses' ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>List</button>
                 <button onClick={() => setCurrentPage('timeline')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${(currentPage as string) === 'timeline' ? 'bg-primary-start text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Timeline</button>
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                 <ExpenseList onEdit={handleEditExpense} />
              </div>
              <div className="space-y-6">
                 <button 
                  onClick={() => setCurrentPage('splitter')}
                  className="w-full glass p-6 rounded-[24px] flex flex-col items-center gap-3 border border-white/5 hover:border-primary-start/50 transition-all group"
                 >
                    <div className="p-3 bg-primary-start/10 rounded-xl group-hover:scale-110 transition-transform">
                       <Plus className="text-primary-start rotate-45" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Bill Splitter</span>
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
                 <button onClick={() => setCurrentPage('subscriptions')} className="px-4 py-2 glass rounded-xl text-xs font-black uppercase tracking-widest text-primary-start hover:bg-primary-start hover:text-white transition-all">Subs</button>
                 <button onClick={() => setCurrentPage('coach')} className="px-4 py-2 glass rounded-xl text-xs font-black uppercase tracking-widest text-primary-start hover:bg-primary-start hover:text-white transition-all">AI Coach</button>
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
    <Layout currentPage={currentPage === 'subscriptions' || currentPage === 'coach' ? 'budgets' : currentPage === 'splitter' || currentPage === 'timeline' ? 'expenses' : currentPage} onPageChange={setCurrentPage}>
      <ToastContainer toasts={toasts} />
      {renderPage()}

      <CurrencyConverter />

      <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col gap-4 z-40">
         <button 
           onClick={() => setCurrentPage('timeline')}
           className="p-4 bg-white/5 glass rounded-2xl text-gray-400 hover:text-white transition-all"
           title="Timeline"
         >
            <Clock size={24} />
         </button>
         <button 
           onClick={() => { setEditExpenseId(null); setShowForm(true); }}
           className="bg-gradient-to-br from-primary-start to-primary-end text-white p-6 rounded-full shadow-[0_0_40px_rgba(var(--primary-glow),0.5)] transition-all hover:scale-110 active:scale-95 group"
         >
           <Plus size={36} className={`transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
         </button>
      </div>

      {showForm && <ExpenseForm onClose={() => { setShowForm(false); setEditExpenseId(null); }} editExpenseId={editExpenseId} />}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} onNavigate={(p) => setCurrentPage(p as Page)} />}
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
