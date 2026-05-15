import { AxiosRequestConfig, create } from "axios";
import { Platform } from "react-native";
import { toApiError } from "./apiError";
import { secureTokenStorage } from "@/storage/secureTokenStorage";

const LOCAL_NETWORK_IP = "192.168.0.13";

const defaultBaseUrl = Platform.select({
  android: __DEV__
    ? "http://10.0.2.2:3000/api"
    : `http://${LOCAL_NETWORK_IP}:3000/api`,
  ios: `http://${LOCAL_NETWORK_IP}:3000/api`,
  default: "http://localhost:3000/api",
});

const getBaseUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl || "http://localhost:3000/api";
};

export const httpClient = create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const shouldLogApi = __DEV__;

const getRequestLabel = (config: AxiosRequestConfig) => {
  const method = config.method?.toUpperCase() || "GET";
  const url = `${config.baseURL || ""}${config.url || ""}`;
  return `${method} ${url}`;
};

const summarizePayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return payload;

  if (Array.isArray(payload)) {
    return { kind: "array", length: payload.length };
  }

  const data = payload as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) return [key, `array(${value.length})`];
      if (value && typeof value === "object") return [key, "object"];
      return [key, value];
    })
  );
};

let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export const setUnauthorizedHandler = (
  handler: (() => void | Promise<void>) | null
) => {
  unauthorizedHandler = handler;
};

httpClient.interceptors.request.use(async (config) => {
  const token = await secureTokenStorage.getToken();

  if (token) {
    if (secureTokenStorage.isTokenExpired(token)) {
      await secureTokenStorage.removeToken();
      await unauthorizedHandler?.();
      throw toApiError({ isAxiosError: true, response: { status: 401 } });
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  if (shouldLogApi) {
    console.log("[API Request]", getRequestLabel(config), {
      params: config.params,
      data: summarizePayload(config.data),
      authenticated: Boolean(token),
    });
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    if (shouldLogApi) {
      console.log("[API Response]", getRequestLabel(response.config), {
        status: response.status,
        data: summarizePayload(response.data),
      });
    }

    return response;
  },
  async (error) => {
    const status = error?.response?.status;

    if (shouldLogApi) {
      console.log("[API Error]", getRequestLabel(error?.config ?? {}), {
        status,
        data: summarizePayload(error?.response?.data),
        message: error?.message,
      });
    }

    if (status === 401 || status === 403) {
      await secureTokenStorage.removeToken();
      await unauthorizedHandler?.();
    }

    return Promise.reject(toApiError(error));
  }
);

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await httpClient.request<T>(config);
  return response.data;
};
