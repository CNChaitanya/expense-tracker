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
    return id;
  };

  const updateExpense = async (id: string, values: Partial<typeof schema.expenses.$inferInsert>) => {
    const db = getDrizzleDb();
    db.update(schema.expenses).set(values).where(eq(schema.expenses.id, id)).run();
    await saveDb();
    await refreshData();
  };

  const deleteExpense = async (id: string) => {
    const db = getDrizzleDb();
    db.delete(schema.expenses).where(eq(schema.expenses.id, id)).run();
    await saveDb();
    await refreshData();
  };

  const duplicateExpense = async (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    const { id: _, createdAt: __, date: ___, ...rest } = expense;
    await addExpense({
      ...rest,
      date: new Date(), // Set to today
    });
  };

  return { expenses, categories, loading, addExpense, updateExpense, deleteExpense, duplicateExpense, refreshData };
};

export const useTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);

  const refresh = useCallback(async () => {
    try {
      const db = getDrizzleDb();
      const all = db.select().from(schema.templates).all();
      setTemplates(all);
    } catch (e) {
      console.error('Templates fetch error', e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTemplate = async (values: Omit<typeof schema.templates.$inferInsert, 'id' | 'createdAt'>) => {
    const db = getDrizzleDb();
    db.insert(schema.templates).values({
      ...values,
      id: uuidv4(),
      createdAt: new Date(),
    }).run();
    await saveDb();
    await refresh();
  };

  const deleteTemplate = async (id: string) => {
    const db = getDrizzleDb();
    db.delete(schema.templates).where(eq(schema.templates.id, id)).run();
    await saveDb();
    await refresh();
  };

  return { templates, addTemplate, deleteTemplate, refresh };
};
