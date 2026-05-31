import { useState, useCallback, useEffect } from 'react';
import { getDrizzleDb, saveDb } from '../db/client';
import * as schema from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const db = getDrizzleDb();
      const allExpenses = db.select().from(schema.expenses).orderBy(desc(schema.expenses.date)).all();
      const allCategories = db.select().from(schema.categories).all();
      setExpenses(allExpenses);
      setCategories(allCategories);
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addExpense = async (values: Omit<typeof schema.expenses.$inferInsert, 'id' | 'createdAt'>) => {
    const db = getDrizzleDb();
    const id = uuidv4();
    db.insert(schema.expenses).values({
      ...values,
      id,
      createdAt: new Date(),
    }).run();
    await saveDb();
    await refreshData();
  };

  const deleteExpense = async (id: string) => {
    const db = getDrizzleDb();
    db.delete(schema.expenses).where(eq(schema.expenses.id, id)).run();
    await saveDb();
    await refreshData();
  };

  return { expenses, categories, loading, addExpense, deleteExpense, refreshData };
};
