import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const TOKEN_KEY = "@app_token";

export const TokenService = {
  getToken: async () => await AsyncStorage.getItem(TOKEN_KEY),
  setToken: async (token: string) =>
    await AsyncStorage.setItem(TOKEN_KEY, token),
  removeToken: async () =>
    await AsyncStorage.removeItem(TOKEN_KEY)
};

const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://192.168.0.12:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

api.interceptors.request.use(async config => {
  const token = await TokenService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getAxiosErrorMessage(error: any) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    "Erro inesperado"
  );
}

export const AuthService = {
  login: async (email: string, senha: string) => {
    try {
      const response = await api.post("/usuarios/login", {
        email,
        senha
      });

      return response.data;
    } catch (error: any) {
      throw new Error(getAxiosErrorMessage(error));
    }
  },

  cadastrar: async (
    email: string,
    senha: string,
    nome: string
  ) => {
    try {
      const response = await api.post("/usuarios/cadastrar", {
        email,
        senha,
        nome
      });

      return response.data;
    } catch (error: any) {
      throw new Error(getAxiosErrorMessage(error));
    }
  }
};
