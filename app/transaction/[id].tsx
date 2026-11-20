import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  deleteTransaction,
  formatCurrency,
  formatDateTime,
  getTransactionById,
} from '../../src/lib/transactions';
import { TransactionRecord } from '../../src/types';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionRecord | null>(null);

  const loadTransaction = useCallback(async () => {
    const item = await getTransactionById(Number(id));
    setTransaction(item);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadTransaction();
    }, [loadTransaction])
  );

  const handleDelete = async () => {
    if (!transaction) {
      return;
    }

    await deleteTransaction(transaction.id);
    router.back();
  };

  if (!transaction) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>Loading transaction...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.badge}>{transaction.type === 'credit' ? 'Credit' : 'Debit'}</Text>
        <Text style={styles.amount}>
          {transaction.type === 'credit' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.meta}>Created: {formatDateTime(transaction.createdAt)}</Text>
      </View>

      <Pressable
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert('Delete transaction', 'Are you sure you want to delete this entry?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => void handleDelete() },
          ]);
        }}
      >
        <Text style={styles.deleteButtonText}>Delete transaction</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  amount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#64748b',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#334155',
  },
});
