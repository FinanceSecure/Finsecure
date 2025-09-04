import axios from "axios";
import { Platform } from "react-native";
import { TokenService } from "./authService";

export interface ExtratoInvestimento {
  tipoInvestimentoId: string,
  nome: string,
  valorTotalInvestido: number,
  valorTotalRendimentoBruto: number,
  valorTotalImposto: number,
  valorTotalRendimentoLiquido: number,
  valorTotalLiquido: number,
  ultimasAplicacoes: {
    id: string,
    dataCompra: string,
    valorInvestido: number,
    rendimentoBruto: number,
    imposto: number,
    rendimentoLiquido: number,
    valorTotalLiquido: number,
  }[];
}

const apiUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://192.168.0.12:3000/api"

const api = axios.create({ baseURL: `${apiUrl}` });

api.interceptors.request.use(async (config) => {
  const token = await TokenService.getToken()
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export const InvestimentoService = {
  async getExtrato(tipoInvestimentoId: string): Promise<ExtratoInvestimento> {
    try {
      const { data } = await api.get(`/investimento/extrato/${tipoInvestimentoId}`);
      return data;
    } catch (e: any) {
      throw new Error("Erro ao retornar o extrato: ", e);
    }
  },
}