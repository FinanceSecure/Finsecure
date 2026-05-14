import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';

const TOKEN_KEY = "finsecure_jwt";
const MEU_IP_REDE = "192.168.0.13";

const BASE_URL = Platform.select({
  android: __DEV__
    ? "http://10.0.2.2:3000/api"
    : `http://${MEU_IP_REDE}:3000/api`,
  ios: `http://${MEU_IP_REDE}:3000/api`,
  default: "http://localhost:3000/api",
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const TokenService = {
  setToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (e) {
      console.warn("Erro ao salvar token", e);
    }
  },
  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },
  getUserToken: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        const decoded: { name: string; userId: string } = jwtDecode(token);
        return decoded;
      }
      return null;
    } catch (e) {
      console.warn("Erro ao decodificar token", e);
      return null;
    }
  },
  removeToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (e) {
      console.warn("Erro ao remover token", e);
    }
  }
};

api.interceptors.request.use(async (config) => {
  const token = await TokenService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const AuthService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/usuarios/login", {
        email,
        password
      });

      return response.data;
    } catch (error: any) {
      let errorMessage = "Erro ao conectar com o servidor";

      if (error.response) {
        errorMessage =
          error.response.data.error
          || error.response.data.message
          || errorMessage;
      } else if (error.request) {
        errorMessage = "Servidor indisponível. Verifique sua conexão.";
      } else {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },

  cadastrar: async (name: string, email: string, password: string) => {
    try {
      const response =
        await api.post("/usuarios/cadastrar", {
          name,
          email,
          password
        });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao criar conta";
      throw new Error(message);
    }
  }
};
