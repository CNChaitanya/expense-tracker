import { parseCurrency } from './currency';

export const parseCSV = (csvText: string, categories: any[]) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const dataRows = lines.slice(1);

  return dataRows.map(row => {
    const values = row.split(',').map(v => v.replace(/"/g, '').trim());
    if (values.length < 2) return null;

    const rowData: any = {};
    headers.forEach((header, index) => {
      rowData[header.toLowerCase()] = values[index];
    });

    const category = categories.find(c => c.name === rowData.category) || categories[0];

    return {
      amount: parseCurrency(rowData.amount),
      type: (rowData.type as 'expense' | 'income') || 'expense',
      categoryId: category.id,
      date: new Date(rowData.date || Date.now()),
      note: rowData.note,
      paymentMethod: (rowData['payment method'] as 'cash' | 'card' | 'upi') || 'cash',
      isRecurring: rowData.recurring === 'Yes',
    };
  }).filter(Boolean);
};
