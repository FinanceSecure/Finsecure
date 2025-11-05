import { Colors } from "@/constants/theme";
import { InvestimentoService } from "@/services/invService";
import { SaldoService } from "@/services/saldoService";
import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { PieChart } from 'react-native-chart-kit';

export default function Dashboard() {
  const screenWidth = Dimensions.get("window").width;
  const [saldo, setSaldo] = useState<number | null>(null);
  const [receita, setReceita] = useState<number | null>(null);
  const [despesa, setDespesa] = useState<number | null>(null);
  const [investimento, setInvestimento] = useState<{
    valorTotalInvestido: number;
    lucroLiquido: number
  } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const saldoAtual = await SaldoService.verificarSaldo();
        setSaldo(Number(saldoAtual.valor));
        const receitas = await SaldoService.verificarReceitas();
        setReceita(Number(receitas.totalReceitas));
        const despesas = await SaldoService.verificarDespesas();
        setDespesa(Number(despesas.totalDespesas));
        const investimentoData = await InvestimentoService.buscarInvestimentos();
        setInvestimento(investimentoData);
      } catch (erro) {
        setErro('Erro ao carregar os dados');
        console.error("Erro:", erro);
        setReceita(0);
        setDespesa(0);
      }
    }
    carregarDados();
  }, []);

  const formatarMoeda = (valor: number | null): string => {
    if (valor === null || valor === undefined) return "Carregando...";
    if (isNaN(valor) || !isFinite(valor)) return "Valor inválido";
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  const PieChartData = useMemo(() => {
    if (
      receita === null ||
      despesa === null ||
      investimento === null
    ) return [];

    const safeReceita = isNaN(receita) ? 0 : receita;
    const safeDespesa = isNaN(despesa) ? 0 : despesa;
    const safeInvestimento = isNaN(investimento.valorTotalInvestido)
      ? 0
      : investimento.valorTotalInvestido;

    const total = safeReceita + safeDespesa + safeInvestimento;
    if (total === 0) return [];

    return [
      {
        name: `Receitas (${((safeReceita / total) * 100).toFixed(1)}%)`,
        population: safeReceita,
        color: Colors.receita,
        legendFontColor: Colors.text,
        legendFontSize: 11,
      },
      {
        name: `Despesas (${((safeDespesa / total) * 100).toFixed(1)}%)`,
        population: safeDespesa,
        color: Colors.despesa,
        legendFontColor: Colors.text,
        legendFontSize: 11,
      },
      {
        name: `Investimentos (${((safeInvestimento / total) * 100).toFixed(1)}%)`,
        population: safeInvestimento,
        color: Colors.primary,
        legendFontColor: Colors.text,
        legendFontSize: 11,
      }
    ];
  }, [receita, despesa, investimento]);

  const chartConfig = {
    backgroundGradientFrom: Colors.background,
    backgroundGradientTo: Colors.background,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.saldoContainer}>
        <Text>Saldo: </Text>
        <Text style={styles.text}>
          {saldo}
        </Text>
      </View>
      <View style={styles.SummaryCard}>
        <View style={styles.resumoItem}>
          <Feather name="arrow-up-circle" size={24} color={Colors.receita} />
          <Text style={styles.resumoTitulo}>Receitas</Text>
          <Text style={[styles.resumoValor, { color: Colors.receita }]}>
            {formatarMoeda(receita)}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.resumoItem}>
          <Feather name="arrow-down-circle" size={24} color={Colors.despesa} />
          <Text style={styles.resumoTitulo}>Despesas</Text>
          <Text style={[styles.resumoValor, { color: Colors.despesa }]}>
            {despesa}
          </Text>
        </View>
      </View>
      <View style={styles.investimentosContainer}>
        <View style={styles.iconInvestimento}>
          <Feather name="trending-up" size={26} color="#4CAF50" />
          <Text style={styles.resumoTitulo}>Investimentos</Text>
        </View>
        <View style={styles.valorInvestimentoContainer}>
          <Text style={styles.lucroLiquido}>
            +{formatarMoeda(investimento?.lucroLiquido ?? 0)}
          </Text>
          <Text style={[styles.resumoValor, { marginTop: 15 }]}>
            {formatarMoeda(investimento?.valorTotalInvestido ?? 0)}
          </Text>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📊 Comparativo</Text>
        {PieChartData.length > 0 ? (
          <PieChart
            data={PieChartData}
            width={screenWidth - 50}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
        ) : (
          <Text style={styles.loadingChartText}>
            Dados insuficientes para geração do gráfico.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#F0F0F5',
  },
  saldoContainer: {
    marginLeft: 30
  },
  text: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },
  SummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resumoItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  resumoTitulo: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
    paddingHorizontal: 10
  },
  resumoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    color: Colors.text
  },
  separator: {
    width: 1,
    height: '90%',
    backgroundColor: '#E0E0E0',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.text,
  },
  loadingChartText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    marginBottom: 15
  },
  textInvestimentoTitle: {
    fontSize: 24,
    color: "#333333",
    marginLeft: 10
  },
  textInvestimento: {
    fontSize: 22,
    marginLeft: 10,
    color: "#333"
  },
  investimentosContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconInvestimento: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 20,
    marginBottom: 20
  },
  valorInvestimentoContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "relative",
    paddingRight: 55,
  },
  lucroLiquido: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 14,
    color: Colors.receita,
    fontWeight: "500",
  },
});
