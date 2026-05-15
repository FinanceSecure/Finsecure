export interface InvestmentSummary {
  totalApplied: number;
  totalRedeemed: number;
  principalBalance: number;
  grossYield: number;
  incomeTax: number;
  netYield: number;
  grossBalance: number;
  netBalance: number;
  investmentCount: number;
}

export interface InvestmentTotals {
  applied: number;
  redeemed: number;
  principalBalance: number;
  grossYield: number;
  incomeTax: number;
  netYield: number;
  grossBalance: number;
  netBalance: number;
}

export interface InvestmentProfitability {
  businessDays: number;
  yieldHistoryCount: number;
}

export interface InvestmentStatementItem {
  id: string;
  investmentTypeId: string;
  name: string;
  benchmarkPercentage: number;
  hasIncomeTax: boolean;
  isRedeemed: boolean;
  createdAt: string;
  startedAt: string;
  purchaseDate: string;
  lastYieldAt: string | null;
  totals: InvestmentTotals;
  profitability: InvestmentProfitability;
  applications: unknown[];
  yields: unknown[];
}

export interface InvestmentStatementResponse {
  summary: InvestmentSummary;
  investments: InvestmentStatementItem[];
}

export interface InvestedAmountResponse {
  totalInvested: number;
  grossBalance: number;
  netBalance: number;
}

export interface InvestmentType {
  id: string;
  name: string;
  type: string;
  benchmarkPercentage: number;
  hasIncomeTax: boolean;
}

export interface InvestmentSimulation {
  rendimentoDiario: number;
  rendimentoMensal: number;
  rendimentoAnual: number;
}

export interface InvestmentTypeDetails extends InvestmentType {
  simulacao?: InvestmentSimulation;
}

export interface ApplyInvestmentDTO {
  investmentTypeId: string;
  investedAmount: number;
  purchaseDate: string;
}

export interface RedeemInvestmentDTO {
  id: string;
  amount: number;
}
