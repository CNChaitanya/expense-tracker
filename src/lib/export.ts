import { formatCurrency } from './currency';

export const exportToCSV = (expenses: any[], categories: any[]) => {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Uncategorized';

  const headers = ['Date', 'Amount', 'Type', 'Category', 'Note', 'Payment Method', 'Recurring'];
  const rows = expenses.map(e => [
    new Date(e.date).toISOString().split('T')[0],
    formatCurrency(e.amount),
    e.type,
    getCategoryName(e.categoryId),
    e.note || '',
    e.paymentMethod,
    e.isRecurring ? 'Yes' : 'No'
  ]);

  const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `exptracker_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (expenses: any[], categories: any[]) => {
  const data = {
    expenses,
    categories,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `exptracker_export_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
