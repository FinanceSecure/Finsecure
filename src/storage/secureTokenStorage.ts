import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

const TOKEN_KEY = "finsecure_jwt";

export interface AuthTokenPayload {
  exp?: number;
  name?: string;
  userId?: string;
  sub?: string;
}

const canUseWebStorage = () =>
  Platform.OS === "web" && typeof window !== "undefined" && Boolean(window.localStorage);

const setTokenValue = async (token: string): Promise<void> => {
  if (canUseWebStorage()) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const getTokenValue = async (): Promise<string | null> => {
  if (canUseWebStorage()) {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
};

const removeTokenValue = async (): Promise<void> => {
  if (canUseWebStorage()) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const secureTokenStorage = {
  setToken: async (token: string): Promise<void> => {
    await setTokenValue(token);
  },

  getToken: async (): Promise<string | null> => {
    return getTokenValue();
  },

  removeToken: async (): Promise<void> => {
    await removeTokenValue();
  },

  getPayload: async (): Promise<AuthTokenPayload | null> => {
    const token = await getTokenValue();
    if (!token) return null;

    try {
      return jwtDecode<AuthTokenPayload>(token);
    } catch {
      await removeTokenValue();
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = jwtDecode<AuthTokenPayload>(token);
      return typeof payload.exp === "number"
        ? Date.now() >= payload.exp * 1000
        : false;
    } catch {
      return true;
    }
  },
};
