import axios from "axios";
import { Platform } from "react-native";
import { TokenService } from "./authService";

interface SaldoResponse {
  id: string;
  valor: number;
  data: string;
  atualizado: string;
  usuarioId: string;
}

const apiUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://192.168.0.12:3000/api"

const api = axios.create({
  baseURL: `${apiUrl}`
});

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

  async verificarReceita(): Promise<number> {
    try {
      const response = (await api.get("/saldo/receita"));
      return response.data.receita;
    } catch (err: any) {
      console.error("Erro ao verificar a receita:", err);
      throw new Error(err)
    }
  },

  async verificarDespesas(): Promise<number> {
    try {
      const response = (await api.get("/saldo/despesas"));
      return response.data.despesas;
    } catch (err: any) {
      console.error("Erro ao verificar as despesas:", err);
      throw new Error(err)
    }
  }
}
