import { Colors } from '@constants/theme';
import { CreateTransactionDTO, TransactionCategory, TransactionService, TransactionType } from '@data/services/transactionService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddTransaction() {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('OTHER');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !amount)
      return Alert.alert('Atenção', 'Preencha o título e o valor.');

    try {
      setIsLoading(true);
      const transactionData: CreateTransactionDTO = {
        title,
        amount: parseFloat(amount.replace(',', '.')),
        date: new Date().toISOString(),
        type,
        category,
        isRecurring: false
      };

      await TransactionService.adicionar(transactionData);
      Alert.alert('Sucesso', 'Transação registrada!');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Transação</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'INCOME' && styles.typeIncomeActive]}
          onPress={() => setType('INCOME')}
        >
          <Ionicons name="arrow-up-circle" size={20} color={type === 'INCOME' ? '#FFF' : Colors.success} />
          <Text style={[styles.typeText, type === 'INCOME' && styles.typeTextActive]}>Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === 'EXPENSE' && styles.typeExpenseActive]}
          onPress={() => setType('EXPENSE')}
        >
          <Ionicons name="arrow-down-circle" size={20} color={type === 'EXPENSE' ? '#FFF' : Colors.error} />
          <Text style={[styles.typeText, type === 'EXPENSE' && styles.typeTextActive]}>Despesa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.inputAmount}
          placeholder="R$ 0,00"
          placeholderTextColor={Colors.text_muted}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Conta de Luz, Salário..."
          placeholderTextColor={Colors.text_muted}
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Salvando..." : "Salvar Transação"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    gap: 8
  },
  typeIncomeActive: {
    backgroundColor: Colors.success
  },
  typeExpenseActive: {
    backgroundColor: Colors.error
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text
  },
  typeTextActive: {
    color: '#FFF'
  },
  form: {
    gap: 20
  },
  label: {
    color: Colors.text_muted,
    fontSize: 14,
    marginBottom: -10
  },
  inputAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    paddingVertical: 10
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16
  },
  saveButton: {
    backgroundColor: Colors.button,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
