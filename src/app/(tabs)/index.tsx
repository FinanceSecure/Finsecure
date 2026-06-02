import { BrandMark } from "@/components/BrandMark";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { ErrorState } from "@/components/Feedback/ErrorState";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/modules/auth/useAuth";
import {
  DashboardInvestmentItem,
  useDashboardSummary,
} from "@/modules/dashboard/useDashboardSummary";
import { FormatarData, FormatarMoeda } from "@/utils/formatters";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const investmentColors = [
  Colors.receita,
  Colors.investimento,
  "#8B5CF6",
  "#F59E0B",
  "#14B8A6",
];
const investmentChartSize = 118;
const chartConfig = {
  color: () => Colors.text,
  backgroundGradientFrom: Colors.surface,
  backgroundGradientTo: Colors.surface,
};

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data, isError, isLoading, isRefetching, refetch } =
    useDashboardSummary();
  const userName = user?.name?.split(" ")[0] || "Usuário";
  const maxFlowValue = Math.max(data?.incomes ?? 0, data?.expenses ?? 0, 1);
  const incomeWidth = getBarWidth(data?.incomes, maxFlowValue);
  const expenseWidth = getBarWidth(data?.expenses, maxFlowValue);
  const goToTransactionType = (type: "INCOME" | "EXPENSE") => {
    router.push({
      pathname: "/(tabs)/addTransaction",
      params: { type },
    });
  };
  const confirmLogout = () => {
    Alert.alert("Sair da conta", "Deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

  if (isLoading)
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.topBar}>
          <BrandMark compact />
          <TouchableOpacity style={styles.iconButton} onPress={confirmLogout}>
            <MaterialIcons name="logout" size={20} color={Colors.text_muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>PATRIMÔNIO CONSOLIDADO</Text>
          <Text style={styles.greeting}>Olá, {userName}</Text>
          <Text style={styles.subtitle}>Visão estratégica do seu capital.</Text>
        </View>

        <TouchableOpacity
          style={styles.balanceCard}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/addTransaction")}
        >
          <View>
            <Text style={styles.cardLabel}>SALDO TOTAL</Text>
            <Text style={styles.balanceValue}>
              {FormatarMoeda(data?.balance)}
            </Text>
            <Text style={styles.positiveText}>
              + {FormatarMoeda(data?.incomeVsExpenseSurplus)} no mês
            </Text>
            <Text style={styles.mutedSmall}>
              resultado financeiro consolidado
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.button} />
        </TouchableOpacity>

        <View style={styles.summaryRow}>
          <MetricCard
            label="Receitas"
            value={FormatarMoeda(data?.incomes)}
            color={Colors.receita}
            icon="arrow-up-circle"
            onPress={() => goToTransactionType("INCOME")}
          />
          <MetricCard
            label="Despesas"
            value={FormatarMoeda(data?.expenses)}
            color={Colors.despesa}
            icon="arrow-down-circle"
            onPress={() => goToTransactionType("EXPENSE")}
          />
          <MetricCard
            label="Invest."
            value={FormatarMoeda(data?.totalInvested)}
            color={Colors.investimento}
            icon="analytics"
            onPress={() => router.push("/(tabs)/investments")}
          />
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Desempenho</Text>
              <Text style={styles.mutedSmall}>
                Evolução patrimonial em 6 meses
              </Text>
            </View>
            <Text style={styles.periodPill}>6 MESES</Text>
          </View>
          <View style={styles.trendChart}>
            {[36, 48, 44, 62, 76, 92].map((height, index) => (
              <View key={height} style={styles.trendColumn}>
                <View
                  style={[
                    styles.trendBar,
                    { height, opacity: 0.48 + index * 0.09 },
                  ]}
                />
                <Text style={styles.trendLabel}>{index + 1}M</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Receitas vs Despesas</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/addTransaction")}
            >
              <Text style={styles.linkText}>Nova transação</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.surplusValue}>
            {FormatarMoeda(data?.incomeVsExpenseSurplus)}
          </Text>
          <Text style={styles.mutedSmall}>Superávit do mês</Text>

          <View style={styles.barGroup}>
            <AmountBar
              value={FormatarMoeda(data?.incomes)}
              label="Receitas"
              width={incomeWidth}
              color={Colors.receita}
              onPress={() => goToTransactionType("INCOME")}
            />
            <AmountBar
              value={FormatarMoeda(data?.expenses)}
              label="Despesas"
              width={expenseWidth}
              color={Colors.despesa}
              onPress={() => goToTransactionType("EXPENSE")}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Investimentos</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/investments")}
            >
              <Text style={styles.linkText}>Ver carteira</Text>
            </TouchableOpacity>
          </View>

          {data?.investments.length ? (
            <View style={styles.investmentContent}>
              <View style={styles.chartWrap}>
                <PieChart
                  data={data.investments.map((item, index) => ({
                    name: item.name,
                    population: item.amount,
                    color: investmentColors[index % investmentColors.length],
                    legendFontColor: Colors.text,
                    legendFontSize: 10,
                  }))}
                  width={investmentChartSize}
                  height={investmentChartSize}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  center={[investmentChartSize / 4, 0]}
                  hasLegend={false}
                  absolute={false}
                />
                <View style={styles.donutHole}>
                  <Text style={styles.donutValue}>
                    {FormatarMoeda(data.totalInvested)}
                  </Text>
                  <Text style={styles.donutLabel}>Total investido</Text>
                </View>
              </View>

              <View style={styles.legend}>
                {data.investments.slice(0, 5).map((item, index) => (
                  <InvestmentLegendItem
                    key={item.id}
                    item={item}
                    color={investmentColors[index % investmentColors.length]}
                  />
                ))}
              </View>
            </View>
          ) : (
            <EmptyState message="Nenhum investimento ativo." />
          )}
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Transações recentes</Text>
            <Text style={styles.linkText}>Ver todas</Text>
          </View>
          {data?.recentTransactions.length ? (
            data.recentTransactions.slice(0, 4).map((item, index) => {
              const isIncome = item.type === "INCOME";
              const isInvestment = item.type === "INVESTMENTS";
              const color = isIncome
                ? Colors.receita
                : isInvestment
                  ? Colors.investimento
                  : Colors.despesa;

              return (
                <View
                  key={item.id ?? `${item.date}-${index}`}
                  style={styles.transactionRow}
                >
                  <View style={styles.transactionIdentity}>
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: `${color}22` },
                      ]}
                    >
                      <Ionicons
                        name={
                          isIncome
                            ? "arrow-up"
                            : isInvestment
                              ? "trending-up"
                              : "arrow-down"
                        }
                        size={14}
                        color={color}
                      />
                    </View>
                    <View>
                      <Text style={styles.transactionTitle}>{item.title}</Text>
                      <Text style={styles.mutedSmall}>
                        {FormatarData(item.date)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.transactionAmount, { color }]}>
                    {isIncome ? "+ " : isInvestment ? "" : "- "}
                    {FormatarMoeda(Math.abs(item.amount))}
                  </Text>
                </View>
              );
            })
          ) : (
            <EmptyState message="Nenhuma transação recente." />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function MetricCard({
  label,
  value,
  color,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.metricCard}
      onPress={onPress}
      activeOpacity={0.78}
    >
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.metricValue, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

function AmountBar({
  value,
  label,
  width,
  color,
  onPress,
}: {
  value: string;
  label: string;
  width: `${number}%`;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.amountBarRow}
      onPress={onPress}
      activeOpacity={0.78}
    >
      <Text style={[styles.amountValue, { color }]}>{value}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width, backgroundColor: color }]} />
      </View>
      <Text style={styles.barLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function InvestmentLegendItem({
  item,
  color,
}: {
  item: DashboardInvestmentItem;
  color: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendName} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.legendMoney}>
        <Text style={styles.legendYield} numberOfLines={1}>
          + {FormatarMoeda(item.netYield || item.grossYield)}
        </Text>
        <Text style={styles.legendAmount}>{FormatarMoeda(item.amount)}</Text>
      </View>
      <Text style={styles.legendPercent}>{item.percentage.toFixed(0)}%</Text>
    </View>
  );
}

function getBarWidth(value = 0, compareValue = value): `${number}%` {
  const maxValue = Math.max(value, compareValue, 1);
  return `${Math.max(8, Math.min(100, (value / maxValue) * 100))}%`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingBottom: 32,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  iconButton: {
    width: 44,
    height: 44,
    position: "absolute",
    right: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: Colors.surfaceElevated,
  },
  hero: {
    marginBottom: 14,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  greeting: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.text_muted,
    fontSize: 12,
    marginTop: 2,
  },
  balanceCard: {
    minHeight: 112,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: "rgba(175, 203, 255, 0.2)",
    padding: 20,
    marginTop: 4,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  balanceValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  positiveText: {
    color: Colors.receita,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  mutedSmall: {
    color: Colors.text_muted,
    fontSize: 11,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metricLabel: {
    color: Colors.text,
    fontSize: 11,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  panel: {
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  panelTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  linkText: {
    color: Colors.button,
    fontSize: 12,
    fontWeight: "600",
  },
  periodPill: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.7,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: "rgba(175, 203, 255, 0.12)",
  },
  trendChart: {
    height: 128,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 14,
  },
  trendColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },
  trendBar: {
    width: "100%",
    maxWidth: 30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.primary,
  },
  trendLabel: {
    color: Colors.text_muted,
    fontSize: 9,
  },
  surplusValue: {
    color: Colors.receita,
    fontSize: 16,
    fontWeight: "700",
  },
  barGroup: {
    gap: 8,
    marginTop: 10,
  },
  amountBarRow: {
    gap: 4,
  },
  amountValue: {
    fontSize: 10,
    fontWeight: "600",
  },
  barTrack: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.background,
  },
  barFill: {
    height: 8,
  },
  barLabel: {
    alignSelf: "flex-end",
    color: Colors.text,
    fontSize: 9,
  },
  investmentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chartWrap: {
    width: investmentChartSize,
    height: investmentChartSize,
    justifyContent: "center",
    alignItems: "center",
  },
  donutHole: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  donutValue: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  donutLabel: {
    color: Colors.text_muted,
    fontSize: 8,
    textAlign: "center",
    marginTop: 2,
  },
  legend: {
    flex: 1,
    gap: 7,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendName: {
    flex: 1,
    color: Colors.text,
    fontSize: 10,
  },
  legendMoney: {
    width: 66,
    alignItems: "flex-end",
  },
  legendYield: {
    color: Colors.receita,
    fontSize: 8,
    fontWeight: "700",
  },
  legendAmount: {
    color: Colors.text,
    fontSize: 9,
    textAlign: "right",
    marginTop: 1,
  },
  legendPercent: {
    color: Colors.text_muted,
    fontSize: 9,
    width: 28,
    textAlign: "right",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  transactionIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  transactionTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
});
