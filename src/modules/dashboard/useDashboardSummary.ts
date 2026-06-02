import { investmentsService } from "@/modules/investments/investments.service";
import { InvestmentStatementItem } from "@/modules/investments/investments.types";
import { transactionsService } from "@/modules/transactions/transactions.service";
import { TransactionItem } from "@/modules/transactions/transactions.types";
import { useQuery } from "@tanstack/react-query";

export interface DashboardInvestmentItem {
  id: string;
  name: string;
  amount: number;
  applied: number;
  grossYield: number;
  netYield: number;
  percentage: number;
}

export interface DashboardSummary {
  balance: number;
  incomes: number;
  expenses: number;
  totalInvested: number;
  recentTransactions: TransactionItem[];
  incomeVsExpenseSurplus: number;
  investments: DashboardInvestmentItem[];
}

export const dashboardKeys = {
  summary: ["dashboard", "summary"] as const,
};

const buildInvestmentBreakdown = (
  investments: InvestmentStatementItem[],
  fallbackTotal: number
): DashboardInvestmentItem[] => {
  const activeInvestments = investments
    .filter((investment) => !investment.isRedeemed)
    .map((investment) => ({
      id: investment.id,
      name: investment.name,
      amount: investment.totals.netBalance || investment.totals.grossBalance || investment.totals.applied,
      applied: investment.totals.applied,
      grossYield: investment.totals.grossYield,
      netYield: investment.totals.netYield,
    }))
    .filter((investment) => investment.amount > 0);
  const total = activeInvestments.reduce((sum, item) => sum + item.amount, 0) || fallbackTotal;

  return activeInvestments
    .map((investment) => ({
      ...investment,
      percentage: total > 0 ? (investment.amount / total) * 100 : 0,
    }))
    .sort((current, next) => next.netYield - current.netYield);
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: async (): Promise<DashboardSummary> => {
      const [statement, invested, investmentStatement] = await Promise.all([
        transactionsService.getStatement(),
        investmentsService.getInvestedAmount(),
        investmentsService.getStatement(),
      ]);
      const totalInvested = invested.netBalance
        || investmentStatement.summary.netBalance
        || invested.totalInvested
        || statement.totalInvested
        || 0;

      const summary = {
        balance: statement.balance ?? 0,
        incomes: statement.incomes ?? 0,
        expenses: statement.expenses ?? 0,
        totalInvested,
        recentTransactions: statement.transactions ?? [],
        incomeVsExpenseSurplus: (statement.incomes ?? 0) - (statement.expenses ?? 0),
        investments: buildInvestmentBreakdown(investmentStatement.investments, totalInvested),
      };

      return summary;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
};
