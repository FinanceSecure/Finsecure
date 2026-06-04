import { getUiErrorMessage, toApiError } from "@/api/apiError";
import { Colors } from "@/constants/theme";
import { useRedeemInvestment } from "@/modules/investments/useInvestments";
import { FormatarMoeda } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

const parseRouteNumber = (value?: string): number => {
  if (!value) return 0;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const parseCurrencyInput = (value: string): number => {
  const normalizedValue = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalizedValue);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const formatCurrencyInput = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function RedeemInvestmentScreen() {
  const router = useRouter();
  const { id, name, balance } = useLocalSearchParams<{
    id: string;
    name: string;
    balance: string;
  }>();
  const investmentId = Array.isArray(id) ? id[0] : id;
  const investmentName = Array.isArray(name) ? name[0] : name;
  const balanceParam = Array.isArray(balance) ? balance[0] : balance;
  const numericBalance = useMemo(
    () => parseRouteNumber(balanceParam),
    [balanceParam],
  );
  const [amount, setAmount] = useState(() =>
    formatCurrencyInput(numericBalance),
  );
  const numericAmount = useMemo(() => parseCurrencyInput(amount), [amount]);
  const redeemInvestment = useRedeemInvestment();

  async function redeemConfirmedAmount() {
    if (!investmentId) {
      Alert.alert("Erro", "Investimento não informado.");
      return;
    }

    if (numericAmount <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    if (numericAmount > numericBalance) {
      Alert.alert("Erro", "Saldo insuficiente para este resgate.");
      return;
    }

    try {
      await redeemInvestment.mutateAsync({
        id: investmentId,
        amount: numericAmount,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert("Sucesso", "Resgate realizado com sucesso.", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/investments"),
        },
      ]);
    } catch (error: unknown) {
      const apiError = toApiError(error);

      const message =
        apiError.code === "VALIDATION" || apiError.code === "CONFLICT"
          ? apiError.message
          : getUiErrorMessage(error, "Erro ao resgatar investimento.");

      Alert.alert("Falha", message);
    }
  }

  function handleRedeem() {
    if (!investmentId || numericAmount <= 0 || numericAmount > numericBalance) {
      redeemConfirmedAmount();
      return;
    }

    Alert.alert(
      "Confirmar resgate",
      `Deseja resgatar ${FormatarMoeda(numericAmount)}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Resgatar",
          style: "destructive",
          onPress: redeemConfirmedAmount,
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Resgatar Investimento</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.investmentName}>{investmentName}</Text>

        <Text style={styles.balanceLabel}>Saldo disponível</Text>

        <Text style={styles.balanceValue}>{FormatarMoeda(numericBalance)}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Valor do resgate</Text>

        <TextInput
          style={styles.inputAmount}
          placeholder="0,00"
          placeholderTextColor={Colors.text_muted}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          style={[
            styles.redeemButton,
            redeemInvestment.isPending && styles.disabledButton,
          ]}
          disabled={redeemInvestment.isPending}
          onPress={handleRedeem}
        >
          {redeemInvestment.isPending ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.redeemButtonText}>Confirmar Resgate</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerSpacer: {
    width: 28,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  investmentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  balanceLabel: {
    marginTop: 15,
    color: Colors.text_muted,
    fontSize: 14,
  },
  balanceValue: {
    marginTop: 5,
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.success,
  },
  form: {
    gap: 20,
  },
  label: {
    color: Colors.text_muted,
    fontSize: 14,
  },
  inputAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    paddingVertical: 10,
  },
  redeemButton: {
    backgroundColor: Colors.error,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  redeemButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
