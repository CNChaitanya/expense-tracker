import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  budgetAmount: integer('budget_amount').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(), // amount in cent-equivalent of base currency
  type: text('type').notNull().$type<'expense' | 'income'>(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  note: text('note'),
  paymentMethod: text('payment_method').notNull().$type<'cash' | 'card' | 'upi'>(),
  receiptImage: text('receipt_image'),
  isRecurring: integer('is_recurring', { mode: 'boolean' }).notNull().default(false),
  recurringInterval: text('recurring_interval').$type<'weekly' | 'monthly'>(),
  mood: text('mood').$type<'happy' | 'neutral' | 'regret' | 'excited' | 'stressed'>(),
  currency: text('currency').default('INR'),
  originalAmount: integer('original_amount'), // if different from base currency
  tags: text('tags'), // Pipe separated tags for easy search
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const expenseTags = sqliteTable('expense_tags', {
  expenseId: text('expense_id')
    .notNull()
    .references(() => expenses.id),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id),
});

export const savingsGoals = sqliteTable('savings_goals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  targetAmount: integer('target_amount').notNull(),
  currentAmount: integer('current_amount').notNull().default(0),
  deadline: integer('deadline', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  interval: text('interval').$type<'monthly' | 'yearly'>().notNull(),
  categoryId: text('category_id').references(() => categories.id),
  nextBilling: integer('next_billing', { mode: 'timestamp' }).notNull(),
  emoji: text('emoji').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  amount: integer('amount'),
  categoryId: text('category_id').references(() => categories.id),
  note: text('note'),
  paymentMethod: text('payment_method').$type<'cash' | 'card' | 'upi'>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
