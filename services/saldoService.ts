import { api, TokenService } from "./authService";

interface SaldoResponse {
  id: string;
  valor: number;
  data: string;
  atualizado: string;
  usuarioId: string;
}

interface ReceitaResponse {
  rendaFixa: number;
  rendaVariavel: number;
  totalReceitas: number;
  detalhes: any;
}

interface DespesaResponse {
  totalDespesas: number;
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

export const SaldoService = {
  async verificarSaldo(): Promise<SaldoResponse> {
    try {
      const response = (await api.get("/saldo/verificar"));
      return response.data;
    } catch (err: any) {
      console.error("Erro ao verificar o saldo:", err);
      throw new Error(err)
    }
  },
  async verificarReceitas(): Promise<ReceitaResponse> {
    try {
      const response = (await api.get("/receita/verificar"));
      return response.data;
    } catch (err: any) {
      console.error("Erro ao verificar as receitas:", err);
      throw new Error(err)
    }
  },
  async verificarRendaFixa(): Promise<ReceitaResponse> {
    try {
      const response = (await api.get("/receita/verificar/renda_fixa"));
      return response.data;
    } catch (err: any) {
      console.error("Erro ao verificar as receitas de renda fixa:", err);
      throw new Error(err)
    }
  },
  async verificarRendaVariavel(): Promise<ReceitaResponse> {
    try {
      const response = (await api.get("/receita/verificar/renda_variavel"));
      return response.data;
    } catch (err: any) {
      console.error("Erro ao verificar as receitas de renda variavel:", err);
      throw new Error(err)
    }
  },
  async verificarDespesas(): Promise<DespesaResponse> {
    try {
      const response = (await api.get("/despesa/verificar"));
      return response.data;
    } catch (err: any) {
      console.error("Erro ao verificar as despesas:", err);
      throw new Error(err)
    }
  },
  async adicionarDespesa(
    valor: number,
    descricao: string,
    data: string
  ): Promise<DespesaResponse> {
    try {
      const response = await api.post("/despesa/adicionar", {
        valor,
        descricao,
        data
      });
      return response.data;
    } catch (err: any) {
      console.error("Erro ao adicionar despesa:", err);
      throw new Error(err)
    }
  },
}
