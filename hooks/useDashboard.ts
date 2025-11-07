import { InvestimentoService } from "@/services/invService";
import { SaldoService } from "@/services/saldoService";
import { DashboardData, InvestimentoData } from "@/types";
import { useEffect, useState } from "react";

const INITIAL_INV: InvestimentoData = {
  valorTotalInvestido: 0,
  lucroLiquido: 0,
  valorTotalRendimentoLiquido: 0
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [saldoRes, receitaRes, despesaRes, investimentoRes] = await Promise.all([
          SaldoService.verificarSaldo(),
          SaldoService.verificarReceitas(),
          SaldoService.verificarDespesas(),
          InvestimentoService.buscarInvestimentos(),
        ]);

        const newSaldo = Number(saldoRes.valor);
        const newReceita = Number(receitaRes.totalReceitas);
        const newDespesa = Number(despesaRes.totalDespesas);

        setData({
          saldo: isNaN(newSaldo) ? 0 : newSaldo,
          receita: isNaN(newReceita) ? 0 : newReceita,
          despesa: isNaN(newDespesa) ? 0 : newDespesa,
          investimentos: investimentoRes
            ? { ...INITIAL_INV, ...investimentoRes }
            : INITIAL_INV
        })
      } catch (e) {
        console.error("Erro ao carregar dados: ", e);
        setError('Erro ao carregar os dados. Tente novamente mais tarde.')
        setData({
          saldo: 0,
          receita: 0,
          despesa: 0,
          investimentos: INITIAL_INV
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, isLoading, error };
}
