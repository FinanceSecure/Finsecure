import { getUiErrorMessage } from "@/api/apiError";
import { Colors, Radius } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCreateTransaction } from "@/modules/transactions/useTransactions";
import {
  TransactionCategory,
  TransactionType,
} from "@/modules/transactions/transactions.types";
import * as Haptics from "expo-haptics";

const parseMoneyInput = (value: string): number => {
  const normalizedValue = value
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalizedValue);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export default function AddTransaction() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const createTransaction = useCreateTransaction();
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("OTHER");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const numericAmount = useMemo(() => parseMoneyInput(amount), [amount]);

  useEffect(() => {
    if (params.type === "INCOME" || params.type === "EXPENSE") {
      setType(params.type);
    }
  }, [params.type]);

  const handleSave = async () => {
    if (!title.trim() || title.trim().length > 100 || numericAmount <= 0) {
      Alert.alert("Atenção", "Preencha uma descrição com até 100 caracteres e valor maior que zero.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(date).getTime())) {
      Alert.alert("Atenção", "Informe a data no formato AAAA-MM-DD.");
      return;
    }

    try {
      await createTransaction.mutateAsync({
        title: title.trim(),
        amount: numericAmount,
        date: new Date(date).toISOString(),
        type,
        category,
        isRecurring: false,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sucesso", "Transação registrada.");
      router.back();
    } catch (error: unknown) {
      Alert.alert("Erro", getUiErrorMessage(error, "Erro ao registrar transação."));
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Transação</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.eyebrow}>MOVIMENTAÇÃO FINANCEIRA</Text>
      <Text style={styles.amountLabel}>VALOR DA TRANSAÇÃO</Text>
      <TextInput
        style={styles.inputAmount}
        placeholder="R$ 0,00"
        placeholderTextColor={Colors.placeholder}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === "INCOME" && styles.typeIncomeActive]}
          onPress={() => setType("INCOME")}
        >
          <Ionicons
            name="arrow-up-circle"
            size={20}
            color={type === "INCOME" ? Colors.background : Colors.success}
          />
          <Text style={[styles.typeText, type === "INCOME" && styles.typeTextActive]}>
            Receita
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === "EXPENSE" && styles.typeExpenseActive]}
          onPress={() => setType("EXPENSE")}
        >
          <Ionicons
            name="arrow-down-circle"
            size={20}
            color={type === "EXPENSE" ? Colors.background : Colors.error}
          />
          <Text style={[styles.typeText, type === "EXPENSE" && styles.typeTextActive]}>
            Despesa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => router.push("/(tabs)/investments")}
        >
          <Ionicons name="trending-up" size={20} color={Colors.primary} />
          <Text style={styles.typeText}>Investir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>CATEGORIA</Text>
        <View style={styles.categoryGrid}>
          {categoryOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.categoryChip,
                category === option.value && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(option.value)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === option.value && styles.categoryChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>DATA</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={Colors.text_muted}
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>DESCRIÇÃO</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Mercado mensal"
          placeholderTextColor={Colors.text_muted}
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          style={[styles.saveButton, createTransaction.isPending && styles.disabledButton]}
          onPress={handleSave}
          disabled={createTransaction.isPending}
        >
          <Text style={styles.saveButtonText}>
            {createTransaction.isPending ? "Salvando..." : "Salvar Transação"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const categoryOptions: { label: string; value: TransactionCategory }[] = [
  { label: "Geral", value: "OTHER" },
  { label: "Moradia", value: "HOUSING" },
  { label: "Alimentação", value: "FOOD" },
  { label: "Transporte", value: "TRANSPORT" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerSpacer: {
    width: 28,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 28,
    padding: 4,
    borderRadius: Radius.medium,
    backgroundColor: Colors.surface,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: Radius.small,
    backgroundColor: "transparent",
    gap: 8,
  },
  typeIncomeActive: {
    backgroundColor: Colors.primary,
  },
  typeExpenseActive: {
    backgroundColor: Colors.primary,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  typeTextActive: {
    color: Colors.background,
  },
  form: {
    gap: 20,
  },
  label: {
    color: Colors.text_muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: -10,
  },
  inputAmount: {
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 14,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.input,
    color: Colors.text,
    padding: 16,
    borderRadius: Radius.medium,
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.input,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.text_muted,
    fontSize: 12,
    fontWeight: "700",
  },
  categoryChipTextActive: {
    color: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: Radius.medium,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: "700",
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  amountLabel: {
    color: Colors.text_muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 20,
  },
});
