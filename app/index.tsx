import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  formatCurrency,
  getTransactionTotals,
  getTransactions,
} from '../src/lib/transactions';
import { TransactionRecord, TransactionType } from '../src/types';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const loadData = useCallback(async () => {
    const [items, totals] = await Promise.all([getTransactions(), getTransactionTotals()]);
    setTransactions(items);
    setTotalDebit(totals.debit);
    setTotalCredit(totals.credit);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Expense Manager</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/add')}>
          <Text style={styles.primaryButtonText}>Add transaction</Text>
        </Pressable>
      </View>

      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, styles.debitCard]}>
          <Text style={styles.summaryLabel}>Debit</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalDebit)}</Text>
        </View>
        <View style={[styles.summaryCard, styles.creditCard]}>
          <Text style={styles.summaryLabel}>Credit</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalCredit)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transactions</Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No transactions yet</Text>
          <Text style={styles.emptyStateText}>Add your first entry to get started.</Text>
        </View>
      ) : (
        transactions.map((transaction) => (
          <Pressable
            key={transaction.id}
            onPress={() =>
              router.push({ pathname: '/transaction/[id]', params: { id: String(transaction.id) } })
            }
            style={styles.transactionCard}
          >
            <View style={styles.transactionRow}>
              <View>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionMeta}>{new Date(transaction.createdAt).toLocaleString()}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'credit' ? styles.creditText : styles.debitText,
                ]}
              >
                {transaction.type === 'credit' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
            <Text style={styles.transactionType}>{getTypeLabel(transaction.type)}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function getTypeLabel(type: TransactionType): string {
  return type === 'credit' ? 'Credit' : 'Debit';
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    minHeight: 110,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  debitCard: {
    backgroundColor: '#fef2f2',
  },
  creditCard: {
    backgroundColor: '#ecfdf5',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0f172a',
  },
  emptyStateText: {
    color: '#475569',
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  transactionDescription: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  transactionAmount: {
    fontWeight: '700',
    fontSize: 18,
  },
  transactionType: {
    marginTop: 10,
    fontSize: 12,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  debitText: {
    color: '#dc2626',
  },
  creditText: {
    color: '#16a34a',
  },
});
