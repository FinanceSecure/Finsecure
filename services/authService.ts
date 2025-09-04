import { AuthResponse } from "@/types/AuthTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

const TOKEN_KEY = "@app_token";

interface TokenPayload {
  usuarioId: string,
  nome: string,
  iat: number,
  exp: number
}

export const TokenService = {
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Erro ao obter o token", error);
      return null;
    }
  },
  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Erro ao salvar o token", error);
    }
  },
  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Erro ao remover o token", error);
    }
  }
};

const localhost =
  Platform.OS === "android"
    ? 'http://10.0.2.2:3000/api'
    : 'http://192.168.0.12:3000/api';

const api = axios.create({
  baseURL: `${localhost}`
});

export const AuthService = {
  login: async (email: string, senha: string) => {
    try {
      const response = await api.post("/usuarios/login", { email, senha });
      return response.data as AuthResponse;
    }
    catch (error: any) {
      console.error("Erro na chamada de login", error);
      const msg =
        error.response?.data?.messagem ||
        error.message?.data?.message ||
        "Erro ao realizar login";
      throw new Error(msg);
    }
  },
  cadastrar: async (
    email: string,
    senha: string,
    nome: string,
  ) => {
    try {
      const response = await api.post("/usuarios/cadastrar", {
        email,
        senha,
        nome,
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro na chamada de cadastro", error);
      const msg =
        error.response?.data?.messagem ||
        error.message?.data?.message ||
        "Erro ao realizar cadastro";
      throw new Error(msg);
    }
  }
};

export function lerDadosToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (err) {
    console.error("Erro ao decodificar token: ", err);
    return null;
  }
}
