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

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const { expenses } = useExpenses();

  const totals = expenses.reduce((acc, curr) => {
    if (curr.type === 'expense') acc.spent += curr.amount;
    else acc.income += curr.amount;
    return acc;
  }, { spent: 0, income: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="glass dark:glass-dark px-4 py-2 rounded-xl text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </header>
      
      <SummaryCards spent={totals.spent} income={totals.income} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <BudgetMonitor />
      </div>

      <TrendChart />

      <ExpenseList />

      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-accent hover:bg-accent-hover text-white p-4 rounded-2xl shadow-xl shadow-accent/40 transition-all hover:scale-110 active:scale-95 z-40"
      >
        <Plus size={32} />
      </button>

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dash');
  const { isReady, error } = useDatabase();
  const { toasts } = useNotifications();

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
      case 'expenses': return <div className="space-y-6 animate-in fade-in duration-500"><h1 className="text-3xl font-bold">Expenses</h1><ExpenseList /></div>;
      case 'budgets': return <div className="space-y-6 animate-in fade-in duration-500"><h1 className="text-3xl font-bold">Budgets</h1><BudgetMonitor /></div>;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      <ToastContainer toasts={toasts} />
      {renderPage()}
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
