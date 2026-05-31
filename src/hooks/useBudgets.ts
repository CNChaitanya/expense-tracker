import { useState, useCallback, useEffect } from 'react';
import { getDrizzleDb, saveDb } from '../db/client';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const useBudgets = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCategories = useCallback(async () => {
    try {
      const db = getDrizzleDb();
      const allCategories = db.select().from(schema.categories).all();
      setCategories(allCategories);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const updateBudget = async (id: string, amountInCents: number) => {
    const db = getDrizzleDb();
    db.update(schema.categories)
      .set({ budgetAmount: amountInCents })
      .where(eq(schema.categories.id, id))
      .run();
    await saveDb();
    await refreshCategories();
  };

  return { categories, loading, updateBudget, refreshCategories };
};
