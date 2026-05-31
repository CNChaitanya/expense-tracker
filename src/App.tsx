import { useState } from 'react';
import { ThemeProvider } from './store/ThemeContext';
import { Layout } from './components/Layout';
import { useDatabase } from './hooks/useDatabase';
import { useExpenses } from './hooks/useExpenses';
import { formatCurrency } from './lib/currency';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Loader2, Plus } from 'lucide-react';

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const { expenses, loading } = useExpenses();

  const totals = expenses.reduce((acc, curr) => {
    if (curr.type === 'expense') acc.spent += curr.amount;
    else acc.income += curr.amount;
    return acc;
  }, { spent: 0, income: 0 });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="glass dark:glass-dark px-4 py-2 rounded-xl text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-red-500">
          <span className="text-sm text-gray-500">Total Spent</span>
          <span className="text-2xl font-bold text-red-500">${formatCurrency(totals.spent)}</span>
        </div>
        <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-green-500">
          <span className="text-sm text-gray-500">Total Income</span>
          <span className="text-2xl font-bold text-green-500">${formatCurrency(totals.income)}</span>
        </div>
        <div className="glass dark:glass-dark p-6 rounded-2xl h-32 flex flex-col justify-center border-l-4 border-accent">
          <span className="text-sm text-gray-500">Net Balance</span>
          <span className="text-2xl font-bold text-accent">${formatCurrency(totals.income - totals.spent)}</span>
        </div>
      </div>

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

function App() {
  const { isReady, error } = useDatabase();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error initializing database: {error.message}
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="text-gray-500 animate-pulse">Initializing SQLite Database...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
