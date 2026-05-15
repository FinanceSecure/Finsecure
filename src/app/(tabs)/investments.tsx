import { EmptyState } from "@/components/Feedback/EmptyState";
import { LoadingState } from "@/components/Feedback/LoadingState";
import { Colors } from "@/constants/theme";
import {
  InvestmentStatementItem,
  InvestmentType,
} from "@/modules/investments/investments.types";
import {
  useInvestedAmount,
  useInvestmentStatement,
  useInvestmentTypes,
} from "@/modules/investments/useInvestments";
import {
  FormatarData,
  FormatarMoeda,
  FormatarPercentual,
} from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function InvestmentsScreen() {
  const router = useRouter();
  const statementQuery = useInvestmentStatement();
  const investedAmountQuery = useInvestedAmount();
  const typesQuery = useInvestmentTypes();

  const isLoading =
    statementQuery.isLoading
    || investedAmountQuery.isLoading
    || typesQuery.isLoading;

  const isRefreshing =
    statementQuery.isRefetching
    || investedAmountQuery.isRefetching
    || typesQuery.isRefetching;

  const refreshData = useCallback(() => {
    statementQuery.refetch();
    investedAmountQuery.refetch();
    typesQuery.refetch();
  }, [investedAmountQuery, statementQuery, typesQuery]);

  if (isLoading) {
    return <LoadingState />;
  }

  const summary = statementQuery.data?.summary;
  const investedAmount = investedAmountQuery.data;
  const statement = statementQuery.data?.investments ?? [];
  const activeInvestments = statement.filter((item) => !item.isRedeemed);
  const types = typesQuery.data ?? [];
  const netBalance = investedAmount?.netBalance ?? summary?.netBalance ?? 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshData}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Carteira</Text>
          <Text style={styles.title}>Investimentos</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={refreshData}>
          <Ionicons name="refresh" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Saldo líquido investido</Text>
        <Text style={styles.balanceValue}>{FormatarMoeda(netBalance)}</Text>

        <View style={styles.summaryGrid}>
          <SummaryPill label="Aplicado" value={FormatarMoeda(summary?.totalApplied)} />
          <SummaryPill label="Resgatado" value={FormatarMoeda(summary?.totalRedeemed)} />
          <SummaryPill label="Rendimento" value={FormatarMoeda(summary?.netYield)} positive />
          <SummaryPill label="IR" value={FormatarMoeda(summary?.incomeTax)} negative />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Minha carteira</Text>
        <Text style={styles.sectionCount}>{activeInvestments.length} ativo(s)</Text>
      </View>

      {activeInvestments.length ? (
        activeInvestments.map((item) => (
          <InvestmentCard
            key={item.id}
            item={item}
            onRedeem={() => {
              router.push({
                pathname: "/investments/redeem/[id]",
                params: {
                  id: item.id,
                  name: item.name,
                  balance: item.totals.netBalance.toString(),
                },
              });
            }}
          />
        ))
      ) : (
        <EmptyState message="Nenhum investimento ativo." />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Opções disponíveis</Text>
      </View>

      {types.length ? (
        types.map((item) => (
          <InvestmentTypeCard
            key={item.id}
            item={item}
            onPress={() => {
              router.push({
                pathname: "/investments/[id]",
                params: { id: item.id },
              });
            }}
          />
        ))
      ) : (
        <EmptyState message="Nenhum tipo de investimento disponível." />
      )}
    </ScrollView>
  );
}

function SummaryPill({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = positive ? Colors.receita : negative ? Colors.despesa : Colors.text;

  return (
    <View style={styles.summaryPill}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function InvestmentCard({
  item,
  onRedeem,
}: {
  item: InvestmentStatementItem;
  onRedeem: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.investimento} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>
            Compra em {FormatarData(item.purchaseDate || item.startedAt || item.createdAt)}
          </Text>
        </View>
        <TouchableOpacity style={styles.redeemButton} onPress={onRedeem}>
          <Text style={styles.redeemText}>Resgatar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardMetrics}>
        <Metric label="Aplicado" value={FormatarMoeda(item.totals.applied)} />
        <Metric label="Líquido" value={FormatarMoeda(item.totals.netBalance)} highlight />
        <Metric label="Rendimento" value={FormatarMoeda(item.totals.netYield)} positive />
      </View>
    </View>
  );
}

function InvestmentTypeCard({
  item,
  onPress,
}: {
  item: InvestmentType;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.typeCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.typeIcon}>
        <Ionicons name="trending-up" size={20} color={Colors.receita} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          {item.type} · {FormatarPercentual(item.benchmarkPercentage)} do CDI
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.icon} />
    </TouchableOpacity>
  );
}

function Metric({
  label,
  value,
  highlight,
  positive,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  const color = positive ? Colors.receita : highlight ? Colors.investimento : Colors.text;

  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  eyebrow: {
    color: Colors.text_muted,
    fontSize: 12,
    textTransform: "uppercase",
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 18,
  },
  cardLabel: {
    color: Colors.text_muted,
    fontSize: 12,
  },
  balanceValue: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  summaryPill: {
    width: "48%",
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
  },
  summaryLabel: {
    color: Colors.text_muted,
    fontSize: 11,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionCount: {
    color: Colors.text_muted,
    fontSize: 12,
  },
  card: {
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(59, 130, 246, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(34, 197, 94, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: Colors.text_muted,
    fontSize: 11,
    marginTop: 3,
  },
  redeemButton: {
    minHeight: 34,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.14)",
  },
  redeemText: {
    color: Colors.despesa,
    fontSize: 12,
    fontWeight: "700",
  },
  cardMetrics: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  metric: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
  },
  metricLabel: {
    color: Colors.text_muted,
    fontSize: 10,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
});
