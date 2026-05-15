export type TransactionType = "INCOME" | "EXPENSE";
export type StatementTransactionType = TransactionType | "INVESTMENTS";

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

export interface TransactionItem {
  id?: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  type: StatementTransactionType;
  category?: TransactionCategory | "INVESTMENTS" | string;
}

export interface TransactionStatementResponse {
  balance: number;
  incomes: number;
  expenses: number;
  totalInvested?: number;
  transactions: TransactionItem[];
}
