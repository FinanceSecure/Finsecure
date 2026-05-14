import { api } from "./authService";

export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionCategory =
  | "SALARY" | "FREELANCE" | "DIVIDENDS" | "CASHBACK" | "BONUS"
  | "FOOD" | "TRANSPORT" | "HEALTH" | "EDUCATION" | "ENTERTAINMENT"
  | "HOUSING" | "UTILITIES" | "OTHER";

export interface CreateTransactionDTO {
  title: string;
  description?: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  isRecurring?: boolean;
}

export const TransactionService = {
  adicionar: async (data: CreateTransactionDTO) => {
    try {
      const response = await api.post("/transacoes/adicionar", data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error
        || error.response?.data?.message
        || "Erro ao adicionar transação";
      throw new Error(message);
    }
  },

  obterExtrato: async () => {
    try {
      const response = await api.get("/transacoes/extrato");
      return response.data;
    } catch (error: any) {
      throw new Error("Erro ao carregar extrato financeiro");
    }
  }
};
