import { api, TokenService } from "./authService";

export interface TipoInvestimentoResponse {
  id: string;
  nome: string;
  tipo: string;
  valorPercentual: number;
  impostoRenda: boolean;
}

export interface AplicacaoResponse {
  id: string;
  tipo: string;
  valor: number;
  data: string;
  investimentoId: string;
}

export interface InvestimentoResponse {
  id: string;
  dataCompra: string;
  dataAtualizacao: string;
  resgatado: boolean;
  usuarioId: string;
  tipoInvestimentoId: string;
  tipoInvestimento: TipoInvestimentoResponse;
  aplicacoes: AplicacaoResponse[];
}

api.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getToken()
    if (token)
      config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export const InvestimentoService = {
  async buscarInvestimentos(): Promise<{
    valorTotalInvestido: number,
    lucroLiquido: number
  }> {
    try {
      const { data } = await api.get("/investimento/extrato");

      let totalAplicado = 0;
      let totalComRendimento = 0;

      const hoje = new Date();

      for (const inv of data.investimentos) {
        const taxaDiaria = inv.tipoInvestimento.valorPercentual;

        for (const aplicacao of inv.aplicacoes) {
          const valor = aplicacao.valor;
          const dataAplicacao = new Date(aplicacao.data);
          const diffMs = Math.abs(hoje.getTime() - dataAplicacao.getTime());
          const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const valorComRendimento = valor * Math.pow(1 + taxaDiaria, dias);

          totalAplicado += valor;
          totalComRendimento += valorComRendimento;
        }
      }
      const lucroLiquido = totalComRendimento - totalAplicado;

      return {
        valorTotalInvestido: data.valorTotalInvestido,
        lucroLiquido
      }
    } catch (err: any) {
      throw new Error("Erro ao buscar investimentos: " + (err.response?.statusText || err.message))
    }
  },

  async buscarExtrato() {
    try {
      const { data } = await api.get('investimento/extrato');
      const investimentoDetalhado = await Promise.all(
        data.investimentos.map(async (inv: any) => {
          const tipoId = inv.tipoInvestimentoId;
          const { data: detalhe } = await api.get(`/investimento/extrato/${tipoId}`);
          return {
            id: tipoId,
            nome: detalhe.nome,
            valorTotalLiquido: detalhe.valorTotalLiquido,
            valorTotalRendimentoLiquido: detalhe.valorTotalRendimentoLiquido
          }
        })
      );

      return {
        data: {
          valorTotalInvestido: data.valorTotalInvestido,
          valorTotalRendimentoLiquido: data.valorTotalRendimentoLiquido,
          lucroLiquido: 0,
          investimentos: investimentoDetalhado
        }
      };
    } catch (err: any) {
      throw new Error(err.message);
    }
  },

  async getTipoInvestimento(tipoInvestimentoId: string): Promise<TipoInvestimentoResponse> {
    try {
      const { data } = await api.get(`/investimento/tipo/${tipoInvestimentoId}`);
      return data;
    } catch (e: any) {
      throw new Error("Erro ao retornar o tipo de investimento: " + e.message);
    }
  },

  async adicionarInvestimento(
    tipoInvestimentoId: string,
    dataCompra: string,
    valorInvestido: number
  ): Promise<InvestimentoResponse> {
    try {
      const { data } = await api.post("/investimento/adicionar", {
        tipoInvestimentoId,
        dataCompra,
        valorInvestido
      });
      return data;
    } catch (e: any) {
      throw new Error("Erro ao adicionar investimento: " + e.message);
    }
  },

  async resgatarInvestimento(tipoInvestimentoId: string, valor?: number): Promise<void> {
    try {
      await api.post(`/investimento/resgatar/${tipoInvestimentoId}`, valor ? { valor } : {});
    } catch (e: any) {
      throw new Error("Erro ao resgatar investimento: " + e.message);
    }
  },
};
