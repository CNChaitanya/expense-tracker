import { useEffect, useState } from 'react';
import { initDb, saveDb } from '../db/client';
import { SqlJsDatabase } from 'drizzle-orm/sql-js';
import * as schema from '../db/schema';

export const useDatabase = () => {
  const [db, setDb] = useState<SqlJsDatabase<typeof schema> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        const drizzleDb = await initDb();
        setDb(drizzleDb);
        setIsReady(true);
      } catch (e) {
        setError(e as Error);
      }
    };
    setup();
  }, []);

  const persist = async () => {
    try {
      await saveDb();
    } catch (e) {
      console.error('Failed to persist database:', e);
    }
  };

  return { db, isReady, error, persist };
};
