# UI Contracts: ExpTracker Baseline

As a local-first web application, the primary "contracts" are the component props and the shared state hooks.

## Database Hook Contract (`useDatabase`)
Exposes the SQLite connection and common query wrappers.

```typescript
interface UseDatabase {
  db: Database | null;
  isReady: boolean;
  error: Error | null;
  executeQuery: (sql: string, params?: any[]) => Promise<any[]>;
  resetDatabase: () => Promise<void>;
}
```

## Expense Form Contract
Shared schema for Add/Edit operations.

```typescript
interface ExpenseFormValues {
  amount: number; // Stored as cents
  type: 'expense' | 'income';
  categoryId: string;
  date: Date;
  note?: string;
  paymentMethod: 'cash' | 'card' | 'upi';
  tags: string[];
  receiptImage?: string; // Base64
  isRecurring: boolean;
  recurringInterval?: 'weekly' | 'monthly';
}
```

## Dashboard Metric Contract
Contract for the summary cards.

```typescript
interface MonthlySummary {
  totalSpent: number;
  totalIncome: number;
  netBalance: number;
  currency: string;
  month: string; // YYYY-MM
}
```

## Export Format (CSV)
Contract for the data portability requirement.

| Column | Format |
|--------|--------|
| date | ISO 8601 |
| amount | Decimal (for readability) |
| type | String |
| category | Name |
| note | String |
| tags | Pipe-separated |
| payment_method | String |
```
