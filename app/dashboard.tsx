import { ChartCard } from "@/components/ChartData";
import { InvestimentoCard } from "@/components/InvestimentoCard";
import { SummaryCard } from "@/components/SummaryCard";
import { Colors } from "@/constants/theme";
import { useDashboardData } from "@/hooks/useDashboard";
import { ChartDataItem } from "@/types";
import { FormatarMoeda } from "@/utils/formatters";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardData();
  const router = useRouter();
  const createPieChartData = (
    receita: number,
    despesa: number,
    valorTotalInvestido: number
  ): ChartDataItem[] => {
    const total = receita + despesa + valorTotalInvestido;
    if (total === 0) return [];

    const calcularPorcentagem = (value: number) => ((value / total) * 100).toFixed(1);

    return [
      {
        name: `(${calcularPorcentagem(receita)}%)`,
        legenda: 'Receita',
        population: receita,
        color: Colors.receita,
        legendFontColor: Colors.text,
        legendFontSize: 11,
      },
      {
        name: `(${calcularPorcentagem(despesa)}%)`,
        legenda: 'Despesa',
        population: despesa,
        color: Colors.despesa,
        legendFontColor: Colors.text,
        legendFontSize: 11,
      },
      {
        name: `(${calcularPorcentagem(valorTotalInvestido)}%)`,
        legenda: 'Investimento',
        population: valorTotalInvestido,
        color: Colors.primary,
        legendFontColor: Colors.text,
        legendFontSize: 11,
      }
    ];
  };

  const pieChartData = useMemo(() => {
    if (!data) return [];
    return createPieChartData(
      data.receita,
      data.despesa,
      data.investimentos.valorTotalInvestido
    );
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando painel...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error ?? "Erro desconhecido"}</Text>
      </View>
    );
  }

  const saldoAtual = data?.saldo ?? 0;
  const receita = data?.receita ?? 0;
  const despesa = data?.despesa ?? 0;
  const investimento = data?.investimentos;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.rowback}>
        <TouchableOpacity onPress={() => router.replace(`/auth/login`)}>
          <Feather size={30} name="log-out" color={"red"} />
        </TouchableOpacity>
      </View>
      <View style={styles.saldoContainer}>
        <Text style={styles.saldoLabel}>Saldo Atual:</Text>
        <Text style={styles.saldoText}>
          {FormatarMoeda(saldoAtual)}
        </Text>
      </View>
      <SummaryCard
        receita={receita}
        despesa={despesa}
        isLoading={isLoading}
      />
      {investimento && (
        <TouchableOpacity onPress={() => router.replace('/invest/investimento')}>
          <InvestimentoCard
            valorTotalInvestido={investimento.valorTotalInvestido}
            lucroLiquido={investimento.lucroLiquido}
            isLoading={isLoading}
          />
        </TouchableOpacity>
      )}
      <ChartCard data={pieChartData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: Colors.background,
  },
  rowback: {
    position: "absolute",
    right: 25,
    top: -25
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text,
  },
  errorText: {
    fontSize: 18,
    color: Colors.despesa,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  saldoContainer: {
    marginLeft: 30,
    marginBottom: 10,
  },
  saldoLabel: {
    fontSize: 16,
    color: '#666',
  },
  saldoText: {
    fontSize: 32,
    color: Colors.text,
    fontWeight: 'bold',
  },
});
