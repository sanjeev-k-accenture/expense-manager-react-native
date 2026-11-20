import * as SQLite from 'expo-sqlite';

import { CURRENCY, TransactionInput, TransactionRecord, TransactionType } from '../types';

const DATABASE_NAME = 'expense-manager.db';

interface DbRow {
  id: number;
  amount: number;
  description: string;
  type: TransactionType;
  created_at: number;
}

async function openDatabase() {
  return SQLite.openDatabaseAsync(DATABASE_NAME);
}

export async function initializeDatabase() {
  const db = await openDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('debit', 'credit')),
      created_at INTEGER NOT NULL
    );
  `);
  await db.closeAsync();
}

export async function getTransactions(): Promise<TransactionRecord[]> {
  const db = await openDatabase();
  const rows = await db.getAllAsync<DbRow>(
    'SELECT id, amount, description, type, created_at FROM transactions ORDER BY created_at DESC'
  );
  await db.closeAsync();

  return rows.map((row) => ({
    id: row.id,
    amount: row.amount,
    description: row.description,
    type: row.type,
    createdAt: row.created_at,
  }));
}

export async function getTransactionById(id: number): Promise<TransactionRecord | null> {
  const db = await openDatabase();
  const row = await db.getFirstAsync<DbRow>(
    'SELECT id, amount, description, type, created_at FROM transactions WHERE id = ?',
    id
  );
  await db.closeAsync();

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    amount: row.amount,
    description: row.description,
    type: row.type,
    createdAt: row.created_at,
  };
}

export async function getTransactionTotals(): Promise<{ debit: number; credit: number }> {
  const db = await openDatabase();
  const debitResult = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount) AS total FROM transactions WHERE type = ?',
    'debit'
  );
  const creditResult = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount) AS total FROM transactions WHERE type = ?',
    'credit'
  );
  await db.closeAsync();

  return {
    debit: Number(debitResult?.total ?? 0),
    credit: Number(creditResult?.total ?? 0),
  };
}

export async function addTransaction(input: TransactionInput): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO transactions (amount, description, type, created_at) VALUES (?, ?, ?, ?)',
    input.amount,
    input.description.trim(),
    input.type,
    Date.now()
  );
  await db.closeAsync();
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await openDatabase();
  await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
  await db.closeAsync();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-IE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);
}
