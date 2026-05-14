import { api } from './authService';

export interface DashboardData {
  balance: number;
  incomes: number;
  expenses: number;
  totalInvested: number;
  recentTransactions: any[];
}

export const FinanceService = {
  getDashboardSummary: async (): Promise<DashboardData> => {
    try {
      const [statementRes, investedRes] = await Promise.all([
        api.get("/transacoes/extrato"),
        api.get("/investimento/total-investido")
      ]);

      return {
        balance: statementRes.data.balance ?? 0,
        incomes: statementRes.data.incomes ?? 0,
        expenses: statementRes.data.expenses ?? 0,
        totalInvested: investedRes.data.totalInvested ?? 0,
        recentTransactions: statementRes.data.transactions ?? [],
      };
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao carregar dados financeiros";
      throw new Error(message);
    }
  },

  getInvestmentTypes: async () => {
    try {
      const response = await api.get("/investimento/tipo");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao buscar tipos de investimento");
    }
  }
};
