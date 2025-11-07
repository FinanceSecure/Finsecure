export interface InvestimentoItem {
  id: string,
  nome: string,
  valorTotalLiquido: number,
  valorTotalRendimentoLiquido: number
}

export interface InvestimentoData {
  valorTotalInvestido: number;
  lucroLiquido: number;
  valorTotalRendimentoLiquido: number,
  investimentos?: InvestimentoItem[];
}

export interface DashboardData {
  saldo: number;
  receita: number;
  despesa: number;
  investimentos: InvestimentoData;
}

export interface ChartDataItem {
  name: string;
  legenda: string,
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}
