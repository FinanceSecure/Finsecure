export interface InvestimentoData {
  valorTotalInvestido: number;
  lucroLiquido: number;
}

export interface DashboardData {
  saldo: number;
  receita: number;
  despesa: number;
  investimento: InvestimentoData;
}

export interface ChartDataItem {
  name: string;
  legenda: string,
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}
