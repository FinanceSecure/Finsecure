import { request } from "@/api/httpClient";
import {
  CreateTransactionDTO,
  StatementTransactionType,
  TransactionItem,
  TransactionStatementResponse,
} from "./transactions.types";

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? value as ApiRecord
    : {};

const asNumber = (value: unknown, fallback = 0): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const normalizeType = (value: unknown): StatementTransactionType => {
  if (value === "INCOME" || value === "EXPENSE") return value;
  if (value === "INVESTMENT" || value === "INVESTMENTS") return "INVESTMENTS";
  return "EXPENSE";
};

const normalizeTransaction = (value: unknown): TransactionItem => {
  const data = asRecord(value);

  return {
    id: asString(data.id ?? data._id),
    title: asString(data.title ?? data.titulo ?? data.description ?? data.descricao, "Transação"),
    description: asString(data.description ?? data.descricao),
    amount: asNumber(data.amount ?? data.valor),
    date: asString(data.date ?? data.data ?? data.createdAt),
    type: normalizeType(data.type ?? data.tipo),
    category: asString(data.category ?? data.categoria),
  };
};

const normalizeStatement = (payload: unknown): TransactionStatementResponse => {
  const data = asRecord(payload);
  const summary = asRecord(data.summary ?? data.resumo);
  const transactions = data.transactions
    ?? data.recentTransactions
    ?? data.transacoes
    ?? data.items
    ?? [];

  const normalized = {
    balance: asNumber(data.balance ?? data.saldo),
    incomes: asNumber(data.incomes ?? data.receitas ?? summary.incomes),
    expenses: asNumber(data.expenses ?? data.despesas ?? summary.expenses),
    totalInvested: asNumber(data.totalInvested ?? summary.invested),
    transactions: (Array.isArray(transactions) ? transactions : [])
      .map(normalizeTransaction)
      .filter((item) => item.id || item.title),
  };

  return normalized;
};

export const transactionsService = {
  create: async (data: CreateTransactionDTO): Promise<void> => {
    await request<unknown>({
      method: "POST",
      url: "/transacoes/adicionar",
      data,
    });
  },

  getStatement: async (): Promise<TransactionStatementResponse> => {
    const payload = await request<unknown>({
      method: "GET",
      url: "/transacoes/extrato",
    });

    return normalizeStatement(payload);
  },
};
