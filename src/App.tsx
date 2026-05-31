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
import { Plus } from 'lucide-react';
import { DashboardSkeleton } from './components/Skeleton';
import { useNotifications } from './hooks/useNotification';
import { ToastContainer } from './components/ToastContainer';

import { ExpenseHeatmap } from './components/ExpenseHeatmap';

import { StreakCounter } from './components/StreakCounter';
import { SmartInsights } from './components/SmartInsights';

import { MonthlyReportCard } from './components/MonthlyReportCard';

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
          <StreakCounter />
        </div>
        <div className="glass dark:glass-dark px-4 py-2 rounded-xl text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </header>

      <SmartInsights />
      
      <MonthlyReportCard />
      
      <SummaryCards spent={totals.spent} income={totals.income} />

      <TrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <BudgetMonitor />
      </div>

      <ExpenseHeatmap />

      <ExpenseList />
    </div>
  );
}

import { GlobalSearch } from './components/GlobalSearch';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';

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
      <div className="flex h-screen items-center justify-center text-red-500 font-bold p-8 text-center">
        Error initializing database: {error.message}
      </div>
    );
  }

  if (!isReady) {
    return (
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dash': return <Dashboard />;
      case 'expenses': return <div className="space-y-6 animate-in fade-in duration-500"><h1 className="text-4xl font-black text-gradient">Expenses</h1><ExpenseList onEdit={handleEditExpense} /></div>;
      case 'budgets': return <div className="space-y-6 animate-in fade-in duration-500"><h1 className="text-4xl font-black text-gradient">Budgets</h1><BudgetMonitor /></div>;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      <ToastContainer toasts={toasts} />
      {renderPage()}

      <button 
        onClick={() => { setEditExpenseId(null); setShowForm(true); }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-gradient-to-br from-primary-start to-primary-end text-white p-4 rounded-full shadow-[0_0_20px_rgba(var(--primary-glow),0.4)] transition-all hover:scale-110 active:scale-95 z-40 group"
      >
        <Plus size={32} className={`transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
      </button>

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
