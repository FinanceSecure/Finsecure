import { InvestimentoService } from "@/services/invService";
import { InvestimentoData } from "@/types";
import { useEffect, useState } from "react";

export const useInvestimentoData = () => {
  const [data, setData] = useState<InvestimentoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestimentos = async () => {
      try {
        setIsLoading(true);
        const { data: extrato } = await InvestimentoService.buscarExtrato();
        setData({
          valorTotalInvestido: extrato.valorTotalInvestido,
          valorTotalRendimentoLiquido: extrato.valorTotalRendimentoLiquido,
          lucroLiquido: extrato.lucroLiquido ?? 0,
          investimentos: extrato.investimentos
        });
      } catch (err: any) {
        console.error("Erro ao carregar investimentos: ", err)
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvestimentos();
  }, []);
  return { data, isLoading, error };
}
