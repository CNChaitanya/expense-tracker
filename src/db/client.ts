// sql.js loaded via CDN as window.initSqlJs
// @ts-ignore - Handle potential ESM/CJS interop issues in some environments
const initSql = typeof initSqlJs === 'function' ? initSqlJs : (initSqlJs as any).default;

import type { Database } from 'sql.js';
import { drizzle } from 'drizzle-orm/sql-js';
import type { SQLJsDatabase } from 'drizzle-orm/sql-js';
import * as schema from './schema';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm?url';

const DB_STORAGE_KEY = 'exptracker_db';

let database: Database | null = null;
let drizzleDb: SQLJsDatabase<typeof schema> | null = null;

export const initDb = async (): Promise<SQLJsDatabase<typeof schema>> => {
  if (drizzleDb) return drizzleDb;

  const SQL = await initSql({
    locateFile: () => sqlWasm,
  });

  const savedDb: Uint8Array | null = await localforage.getItem(DB_STORAGE_KEY);
  
  database = savedDb ? new SQL.Database(savedDb) : new SQL.Database();
  drizzleDb = drizzle(database!, { schema });

  database!.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      budget_amount INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      category_id TEXT NOT NULL REFERENCES categories(id),
      date INTEGER NOT NULL,
      note TEXT,
      payment_method TEXT NOT NULL,
      receipt_image TEXT,
      is_recurring INTEGER NOT NULL DEFAULT 0,
      recurring_interval TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS expense_tags (
      expense_id TEXT NOT NULL REFERENCES expenses(id),
      tag_id TEXT NOT NULL REFERENCES tags(id)
    );
  `);

  // Seed initial categories if empty
  const categoryCount = drizzleDb.select().from(schema.categories).all().length;
  if (categoryCount === 0) {
    const initialCategories = [
      { id: uuidv4(), name: 'Food', icon: 'Utensils', color: 'text-orange-500', createdAt: new Date() },
      { id: uuidv4(), name: 'Transport', icon: 'Bus', color: 'text-blue-500', createdAt: new Date() },
      { id: uuidv4(), name: 'Shopping', icon: 'ShoppingBag', color: 'text-purple-500', createdAt: new Date() },
      { id: uuidv4(), name: 'Housing', icon: 'Home', color: 'text-green-500', createdAt: new Date() },
      { id: uuidv4(), name: 'Entertainment', icon: 'Film', color: 'text-pink-500', createdAt: new Date() },
    ];
    
    for (const cat of initialCategories) {
      drizzleDb.insert(schema.categories).values(cat).run();
    }
    const data = database!.export();
    await localforage.setItem(DB_STORAGE_KEY, data);
  }

  return drizzleDb;
};

export const saveDb = async () => {
  if (database) {
    const data = database!.export();
    await localforage.setItem(DB_STORAGE_KEY, data);
  }
};

export const getDrizzleDb = () => {
  if (!drizzleDb) throw new Error('Database not initialized');
  return drizzleDb;
};
