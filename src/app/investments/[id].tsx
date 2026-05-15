import { getUiErrorMessage } from "@/api/apiError";
import { LoadingState } from "@/components/Feedback/LoadingState";
import { Colors } from "@/constants/theme";
import {
  useApplyInvestment,
  useInvestmentTypeDetails,
} from "@/modules/investments/useInvestments";
import { FormatarMoeda } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MIN_INVESTMENT_AMOUNT = 1;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getTodayInputDate = () => new Date().toISOString().split("T")[0];

const parseCurrencyInput = (value: string): number => {
  const normalizedValue = value
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalizedValue);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export default function InvestmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [amount, setAmount] = useState("1000");
  const [purchaseDate, setPurchaseDate] = useState(getTodayInputDate());
  const numericAmount = useMemo(() => parseCurrencyInput(amount), [amount]);
  const investmentId = Array.isArray(id) ? id[0] : id;
  const detailsQuery = useInvestmentTypeDetails(investmentId || "", numericAmount);
  const applyInvestment = useApplyInvestment();

  const handleConfirmInvestment = async () => {
    if (!investmentId) {
      Alert.alert("Falha", "Tipo de investimento não informado.");
      return;
    }

    if (numericAmount < MIN_INVESTMENT_AMOUNT) {
      Alert.alert("Erro", "Insira um valor válido para investir.");
      return;
    }

    if (!DATE_PATTERN.test(purchaseDate) || Number.isNaN(new Date(purchaseDate).getTime())) {
      Alert.alert("Erro", "Informe a data do investimento no formato AAAA-MM-DD.");
      return;
    }

    try {
      await applyInvestment.mutateAsync({
        investmentTypeId: investmentId,
        investedAmount: numericAmount,
        purchaseDate,
      });

      Alert.alert(
        "Sucesso",
        `Você investiu ${FormatarMoeda(numericAmount)} com sucesso.`,
        [{ text: "OK", onPress: () => router.replace("/(tabs)/investments") }]
      );
    } catch (error: unknown) {
      Alert.alert("Falha", getUiErrorMessage(error, "Erro ao realizar investimento."));
    }
  };

  if (detailsQuery.isLoading) {
    return <LoadingState />;
  }

  const investment = detailsQuery.data;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{investment?.name || "Investimento"}</Text>
        <Text style={styles.category}>{investment?.type || "Renda fixa"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Quanto você quer investir?</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <Text style={[styles.label, styles.dateLabel]}>Data do investimento</Text>
        <TextInput
          style={styles.dateInput}
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          keyboardType="numbers-and-punctuation"
          placeholder="AAAA-MM-DD"
          placeholderTextColor={Colors.placeholder}
        />
      </View>

      <View style={styles.simulationContainer}>
        <Text style={styles.sectionTitle}>Simulação de Rendimento</Text>

        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Rendimento diário</Text>
          <Text style={styles.simValue}>
            {FormatarMoeda(investment?.simulacao?.rendimentoDiario)}
          </Text>
        </View>

        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Rendimento mensal</Text>
          <Text style={styles.simValue}>
            {FormatarMoeda(investment?.simulacao?.rendimentoMensal)}
          </Text>
        </View>

        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Rendimento anual estimado</Text>
          <Text style={styles.simValue}>
            {FormatarMoeda(investment?.simulacao?.rendimentoAnual)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.investButton, applyInvestment.isPending && styles.disabledButton]}
        onPress={handleConfirmInvestment}
        disabled={applyInvestment.isPending}
      >
        {applyInvestment.isPending ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.investButtonText}>Confirmar Investimento</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 25,
    paddingTop: 60,
    backgroundColor: Colors.surface,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  category: {
    fontSize: 16,
    color: Colors.success,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.text_muted,
    fontSize: 14,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  input: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "bold",
    flex: 1,
  },
  dateLabel: {
    marginTop: 18,
  },
  dateInput: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  simulationContainer: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  simRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  simLabel: {
    color: Colors.text_muted,
    fontSize: 16,
    flex: 1,
    paddingRight: 12,
  },
  simValue: {
    color: Colors.success,
    fontSize: 16,
    fontWeight: "bold",
  },
  investButton: {
    backgroundColor: Colors.success,
    margin: 25,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  investButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
