import { request } from "@/api/httpClient";
import {
  ApplyInvestmentDTO,
  InvestedAmountResponse,
  InvestmentStatementItem,
  InvestmentStatementResponse,
  InvestmentType,
  InvestmentTypeDetails,
  RedeemInvestmentDTO,
} from "./investments.types";

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

const readId = (data: ApiRecord): string =>
  asString(data.id ?? data._id ?? data.investmentId ?? data.investimentoId);

const normalizeTotals = (source: ApiRecord) => ({
  applied: asNumber(source.applied ?? source.totalApplied ?? source.valorTotalInvestido),
  redeemed: asNumber(source.redeemed ?? source.totalRedeemed ?? source.valorTotalResgatado),
  principalBalance: asNumber(source.principalBalance ?? source.saldoPrincipal),
  grossYield: asNumber(source.grossYield ?? source.valorTotalRendimentoBruto),
  incomeTax: asNumber(source.incomeTax ?? source.valorTotalImposto),
  netYield: asNumber(source.netYield ?? source.valorTotalRendimentoLiquido),
  grossBalance: asNumber(source.grossBalance ?? source.valorTotalBruto),
  netBalance: asNumber(source.netBalance ?? source.valorTotalLiquido ?? source.valorTotalInvestido),
});

const normalizeInvestmentStatementItem = (value: unknown): InvestmentStatementItem => {
  const data = asRecord(value);
  const totals = normalizeTotals(asRecord(data.totals).applied !== undefined ? asRecord(data.totals) : data);

  return {
    id: readId(data),
    investmentTypeId: asString(data.investmentTypeId ?? data.tipoInvestimentoId ?? data.typeId),
    name: asString(data.name ?? data.nome ?? data.tipo ?? data.description, "Investimento"),
    benchmarkPercentage: asNumber(data.benchmarkPercentage ?? data.percentualBenchmark),
    hasIncomeTax: Boolean(data.hasIncomeTax ?? data.temImpostoRenda),
    isRedeemed: Boolean(data.isRedeemed ?? data.resgatado),
    createdAt: asString(data.createdAt ?? data.criadoEm),
    startedAt: asString(data.startedAt ?? data.iniciadoEm ?? data.purchaseDate ?? data.dataCompra),
    purchaseDate: asString(data.purchaseDate ?? data.dataCompra ?? data.startedAt ?? data.createdAt),
    lastYieldAt: asString(data.lastYieldAt ?? data.ultimoRendimentoEm) || null,
    totals,
    profitability: {
      businessDays: asNumber(asRecord(data.profitability).businessDays ?? data.diasUteis),
      yieldHistoryCount: asNumber(asRecord(data.profitability).yieldHistoryCount ?? data.quantidadeRendimentos),
    },
    applications: Array.isArray(data.applications) ? data.applications : [],
    yields: Array.isArray(data.yields) ? data.yields : [],
  };
};

const normalizeStatement = (payload: unknown): InvestmentStatementResponse => {
  const data = asRecord(payload);
  const investmentsPayload =
    data.investments ?? data.investimentos ?? data.items ?? data.data ?? payload;
  const investments = (Array.isArray(investmentsPayload) ? investmentsPayload : [])
    .map(normalizeInvestmentStatementItem)
    .filter((item) => item.id);
  const sourceSummary = asRecord(data.summary ?? data.resumo ?? data);
  const totalsFromItems = investments.reduce(
    (acc, item) => ({
      totalApplied: acc.totalApplied + item.totals.applied,
      totalRedeemed: acc.totalRedeemed + item.totals.redeemed,
      principalBalance: acc.principalBalance + item.totals.principalBalance,
      grossYield: acc.grossYield + item.totals.grossYield,
      incomeTax: acc.incomeTax + item.totals.incomeTax,
      netYield: acc.netYield + item.totals.netYield,
      grossBalance: acc.grossBalance + item.totals.grossBalance,
      netBalance: acc.netBalance + item.totals.netBalance,
    }),
    {
      totalApplied: 0,
      totalRedeemed: 0,
      principalBalance: 0,
      grossYield: 0,
      incomeTax: 0,
      netYield: 0,
      grossBalance: 0,
      netBalance: 0,
    }
  );

  const summary = {
    totalApplied: asNumber(sourceSummary.totalApplied ?? sourceSummary.valorTotalInvestido, totalsFromItems.totalApplied),
    totalRedeemed: asNumber(sourceSummary.totalRedeemed ?? sourceSummary.valorTotalResgatado, totalsFromItems.totalRedeemed),
    principalBalance: asNumber(sourceSummary.principalBalance ?? sourceSummary.saldoPrincipal, totalsFromItems.principalBalance),
    grossYield: asNumber(sourceSummary.grossYield ?? sourceSummary.valorTotalRendimentoBruto, totalsFromItems.grossYield),
    incomeTax: asNumber(sourceSummary.incomeTax ?? sourceSummary.valorTotalImposto, totalsFromItems.incomeTax),
    netYield: asNumber(sourceSummary.netYield ?? sourceSummary.valorTotalRendimentoLiquido, totalsFromItems.netYield),
    grossBalance: asNumber(sourceSummary.grossBalance ?? sourceSummary.valorTotalBruto, totalsFromItems.grossBalance),
    netBalance: asNumber(sourceSummary.netBalance ?? sourceSummary.valorTotalLiquido, totalsFromItems.netBalance),
    investmentCount: asNumber(sourceSummary.investmentCount ?? sourceSummary.quantidadeInvestimentos, investments.length),
  };

  if (__DEV__) {
    console.log("[InvestmentsService] Statement normalizado", {
      investments: investments.length,
      netBalance: summary.netBalance,
      totalApplied: summary.totalApplied,
    });
  }

  return { summary, investments };
};

const normalizeInvestedAmount = (payload: unknown): InvestedAmountResponse => {
  const data = asRecord(payload);
  return {
    totalInvested: asNumber(data.totalInvested ?? data.valorTotalInvestido),
    grossBalance: asNumber(data.grossBalance ?? data.valorTotalBruto ?? data.valorTotalInvestido),
    netBalance: asNumber(data.netBalance ?? data.valorTotalLiquido ?? data.valorTotalInvestido),
  };
};

const normalizeType = (value: unknown): InvestmentType => {
  const data = asRecord(value);
  return {
    id: readId(data),
    name: asString(data.name ?? data.nome, "Investimento"),
    type: asString(data.type ?? data.tipo, "Renda fixa"),
    benchmarkPercentage: asNumber(data.benchmarkPercentage ?? data.percentualBenchmark),
    hasIncomeTax: Boolean(data.hasIncomeTax ?? data.temImpostoRenda),
  };
};

const normalizeTypes = (payload: unknown): InvestmentType[] => {
  const data = asRecord(payload);
  const items = data.types ?? data.tipos ?? data.investmentTypes ?? data.data ?? payload;
  return (Array.isArray(items) ? items : []).map(normalizeType).filter((item) => item.id);
};

const normalizeTypeDetails = (payload: unknown): InvestmentTypeDetails => {
  const data = asRecord(payload);
  const base = normalizeType(data.data ?? payload);
  const simulation = asRecord(data.simulacao ?? data.simulation);

  return {
    ...base,
    simulacao: {
      rendimentoDiario: asNumber(simulation.rendimentoDiario ?? simulation.dailyYield),
      rendimentoMensal: asNumber(simulation.rendimentoMensal ?? simulation.monthlyYield),
      rendimentoAnual: asNumber(simulation.rendimentoAnual ?? simulation.annualYield),
    },
  };
};

export const investmentsService = {
  getStatement: async (): Promise<InvestmentStatementResponse> => {
    const payload = await request<unknown>({
      method: "GET",
      url: "/investimento/extrato",
    });

    return normalizeStatement(payload);
  },

  getInvestedAmount: async (): Promise<InvestedAmountResponse> => {
    const payload = await request<unknown>({
      method: "GET",
      url: "/investimento/total-investido",
    });

    return normalizeInvestedAmount(payload);
  },

  getTypes: async (): Promise<InvestmentType[]> => {
    const payload = await request<unknown>({
      method: "GET",
      url: "/investimento/tipo",
    });

    return normalizeTypes(payload);
  },

  getTypeById: async (
    id: string,
    amount?: number
  ): Promise<InvestmentTypeDetails> => {
    const payload = await request<unknown>({
      method: "GET",
      url: `/investimento/tipo/${id}`,
      params: amount ? { valor: amount } : undefined,
    });

    return normalizeTypeDetails(payload);
  },

  apply: async (data: ApplyInvestmentDTO): Promise<void> => {
    await request<unknown>({
      method: "POST",
      url: "/investimento/adicionar",
      data,
    });
  },

  redeem: async ({ id, amount }: RedeemInvestmentDTO): Promise<void> => {
    await request<unknown>({
      method: "POST",
      url: `/investimento/resgatar/${id}`,
      data: { amount },
    });
  },
};
