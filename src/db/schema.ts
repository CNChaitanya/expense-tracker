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
  amount: integer('amount').notNull(),
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
