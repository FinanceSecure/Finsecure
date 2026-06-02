import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "financesecure.accessToken";
let webRuntimeToken: string | null = null;

export interface AuthTokenPayload {
  exp?: number;
  name?: string;
  userId?: string;
  sub?: string;
}

const getWebSessionStorage = (): Storage | null => {
  if (Platform.OS !== "web" || typeof sessionStorage === "undefined") {
    return null;
  }

  return sessionStorage;
};

export async function saveAccessToken(token: string): Promise<void> {
  const webStorage = getWebSessionStorage();

  if (webStorage && __DEV__) {
    webStorage.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }

  if (Platform.OS === "web") {
    webRuntimeToken = token;
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  const webStorage = getWebSessionStorage();

  if (webStorage && __DEV__) {
    return webStorage.getItem(ACCESS_TOKEN_KEY);
  }

  if (Platform.OS === "web") {
    return webRuntimeToken;
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function removeAccessToken(): Promise<void> {
  const webStorage = getWebSessionStorage();

  if (webStorage) {
    webStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (Platform.OS === "web") {
    webRuntimeToken = null;
    return;
  }

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function getAccessTokenPayload(): Promise<AuthTokenPayload | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<AuthTokenPayload>(token);
  } catch {
    await removeAccessToken();
    return null;
  }
}

export function isAccessTokenExpired(token: string): boolean {
  try {
    const payload = jwtDecode<AuthTokenPayload>(token);
    return typeof payload.exp === "number"
      ? Date.now() >= payload.exp * 1000
      : false;
  } catch {
    return true;
  }
}

export const authTokenStorage = {
  setToken: saveAccessToken,
  getToken: getAccessToken,
  removeToken: removeAccessToken,
  getPayload: getAccessTokenPayload,
  isTokenExpired: isAccessTokenExpired,
};
