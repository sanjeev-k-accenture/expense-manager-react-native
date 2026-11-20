export type TransactionType = 'debit' | 'credit';

export interface TransactionRecord {
  id: number;
  amount: number;
  description: string;
  type: TransactionType;
  createdAt: number;
}

export interface TransactionInput {
  amount: number;
  description: string;
  type: TransactionType;
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  debit: 'Debit',
  credit: 'Credit',
};

export const CURRENCY = 'EUR';
