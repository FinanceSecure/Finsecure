import { api } from "@/data/services/authService";
import { FormatarMoeda } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useEffect,
  useState
} from "react";
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function InvestmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [amount, setAmount] = useState("1000");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [investment, setInvestment] = useState<any>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (id && amount) {
        loadDetails();
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [amount, id]);

  async function loadDetails() {
    try {
      setLoading(true);
      const valorParaSimular = amount.replace(',', '.') || "0";
      const response = await api.get(`/investimento/tipo/${id}?valor=${valorParaSimular}`);
      setInvestment(response.data);
    } catch (error) {
      console.log("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSimulate = () => loadDetails();

  async function handleConfirmInvestment() {
    try {
      setSubmitting(true);

      const valorNumerico = parseFloat(amount.replace(',', '.'));
      if (valorNumerico <= 0) {
        Alert.alert("Erro", "Insira um valor válido para investir.");
        return;
      }

      const dataFormatada = new Date().toISOString().split('T')[0];

      await api.post("/investimento/adicionar", {
        investmentTypeId: id,
        investedAmount: valorNumerico,
        purchaseDate: dataFormatada
      });

      Alert.alert(
        "Sucesso!",
        `Você investiu ${FormatarMoeda(valorNumerico)} com sucesso.`,
        [{ text: "OK", onPress: () => router.replace("/(tabs)/investments") }]
      );
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao realizar investimento.";
      Alert.alert("Falha", msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{investment?.name}</Text>
        <Text style={styles.category}>{investment?.type}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Quanto você quer investir?</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#666"
            onBlur={handleSimulate}
          />
        </View>
      </View>

      <View style={styles.simulationContainer}>
        <Text style={styles.sectionTitle}>Simulação de Rendimento</Text>

        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Rendimento Diário</Text>
          <Text style={styles.simValue}>
            {FormatarMoeda(investment?.simulacao?.rendimentoDiario)}
          </Text>
        </View>

        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Rendimento Mensal</Text>
          <Text style={styles.simValue}>
            {FormatarMoeda(investment?.simulacao?.rendimentoMensal)}
          </Text>
        </View>

        <View style={styles.simRow}>
          <Text style={styles.simLabel}>Rendimento Anual (Estimado)</Text>
          <Text style={styles.simValue}>
            {FormatarMoeda(investment?.simulacao?.rendimentoAnual)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.investButton, submitting && { opacity: 0.7 }]}
        onPress={handleConfirmInvestment}
        disabled={submitting}
      >
        {submitting ? (
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
    backgroundColor: "#000"
  },
  center: {
    flex: 1, justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  header: {
    padding: 25, paddingTop: 60,
    backgroundColor: "#0a0a0a"
  },
  backButton: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  },
  category: {
    fontSize: 16,
    color: "#2ecc71",
    marginTop: 4
  },
  card: {
    backgroundColor: "#1a1a1a",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  label: {
    color: "#888",
    fontSize: 14,
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  currency: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8
  },
  input: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    flex: 1
  },
  simulationContainer: {
    paddingHorizontal: 25,
    marginTop: 10
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20
  },
  simRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  simLabel: {
    color: "#aaa",
    fontSize: 16
  },
  simValue: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "bold"
  },
  investButton: {
    backgroundColor: "#2ecc71",
    margin: 25,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  investButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold"
  },
});
