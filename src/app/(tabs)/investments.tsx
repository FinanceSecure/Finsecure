import { Colors } from "@/constants/theme";
import { api } from "@/data/services/authService";
import { FormatarPercentual } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface InvestmentType {
  id: string;
  name: string;
  type: string;
  benchmarkPercentage: number;
  hasIncomeTax: boolean;
}

export default function InvestmentsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [investments, setInvestments] = useState<InvestmentType[]>([]);

  useEffect(() => {
    loadScreenData();
  }, []);

  async function loadScreenData() {
    try {
      setLoading(true);
      const [typesRes, totalRes] = await Promise.all([
        api.get("/investimento/tipo"),
        api.get("/investimento/total-investido")
      ]);

      setInvestments(typesRes.data);
      setTotalInvested(totalRes.data.totalInvested || 0);
    } catch (error) {
      console.log("Erro ao carregar dados de investimento:", error);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: InvestmentType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`../investments/${item.id}`);
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="trending-up" size={24} color="#2ecc71" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>
            {item.type} • {FormatarPercentual(item.benchmarkPercentage)} do CDI
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.balanceTitle}>Total Investido</Text>
        <Text style={styles.balanceValue}>
          R$ {totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.title}>Onde vamos investir hoje?</Text>
        <Text style={styles.subtitle}>Escolha uma opção para simular</Text>
      </View>

      <FlatList
        data={investments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum investimento disponível no momento.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background
  },
  header: {
    padding: 25,
    paddingTop: 60,
    backgroundColor: Colors.surface
  },
  backButton: {
    marginBottom: 20
  },
  balanceTitle: {
    color: "#888",
    fontSize: 14,
    textTransform: "uppercase"
  },
  balanceValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surface,
    marginVertical: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333"
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"
  },
  details: {
    fontSize: 13,
    color: "#888",
    marginTop: 2
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 50
  },
});
