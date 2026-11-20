import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { addTransaction } from '../src/lib/transactions';
import { TransactionType } from '../src/types';

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('debit');

  const handleSave = async () => {
    const numericAmount = Number.parseInt(amount, 10);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing description', 'Please add a short description for this transaction.');
      return;
    }

    await addTransaction({
      amount: numericAmount,
      description: description.trim(),
      type,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New transaction</Text>

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeRow}>
        {(['debit', 'credit'] as const).map((option) => (
          <Pressable
            key={option}
            onPress={() => setType(option)}
            style={[styles.typeButton, type === option && styles.typeButtonSelected]}
          >
            <Text style={[styles.typeButtonText, type === option && styles.typeButtonTextSelected]}>
              {option === 'debit' ? 'Debit' : 'Credit'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        placeholder="e.g. 250"
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Groceries"
        style={[styles.input, styles.textArea]}
        multiline
      />

      <Pressable style={styles.saveButton} onPress={() => void handleSave()}>
        <Text style={styles.saveButtonText}>Save transaction</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#0f172a',
  },
  typeButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 20,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
