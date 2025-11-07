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
      return {
        id: "",
        valor: 0,
        data: new Date().toISOString(),
        atualizado: new Date().toISOString(),
        usuarioId: ""
      }
    }
  },
  async verificarReceitas(): Promise<ReceitaResponse> {
    try {
      const response = (await api.get("/receita/verificar"));
      return response.data;
    } catch (err: any) {
      return {
        rendaFixa: 0,
        rendaVariavel: 0,
        totalReceitas: 0,
        detalhes: {}
      }
    }
  },
  async verificarRendaFixa(): Promise<ReceitaResponse> {
    try {
      const response = (await api.get("/receita/verificar/renda_fixa"));
      return response.data;
    } catch (err: any) {
      return {
        rendaFixa: 0,
        rendaVariavel: 0,
        totalReceitas: 0,
        detalhes: [],
      };
    }
  },
  async verificarRendaVariavel(): Promise<ReceitaResponse> {
    try {
      const response = (await api.get("/receita/verificar/renda_variavel"));
      return response.data;
    } catch (err: any) {
      return {
        rendaFixa: 0,
        rendaVariavel: 0,
        totalReceitas: 0,
        detalhes: [],
      }
    }
  },
  async verificarDespesas(): Promise<DespesaResponse> {
    try {
      const response = (await api.get("/despesa/verificar"));
      return response.data;
    } catch (err: any) {
      return {
        totalDespesas: 0
      }
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
