import { Colors } from "@/constants/theme";
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

  const chartData = useMemo(() => {
    if (receita === null || despesa === null) return [];

    const safeReceita = isNaN(receita) ? 0 : receita;
    const safeDespesa = isNaN(despesa) ? 0 : despesa;
    const total = safeReceita + safeDespesa;
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
      }
    ];
  }, [receita, despesa]);

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
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📊 Comparativo Financeiro</Text>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
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
    marginTop: 20,
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
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  resumoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  separator: {
    width: 1,
    height: '90%',
    backgroundColor: '#E0E0E0',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 30,
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
    marginBottom: 10
  },
  investimentosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
});
