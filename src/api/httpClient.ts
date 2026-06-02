import { AxiosRequestConfig, create } from "axios";
import { ApiError, toApiError } from "./apiError";
import { authTokenStorage } from "@/storage/authTokenStorage";
import { API_BASE_URL } from "./apiConfig";
import { ApiResponse } from "@/types";

export const httpClient = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export const setUnauthorizedHandler = (
  handler: (() => void | Promise<void>) | null
) => {
  unauthorizedHandler = handler;
};

httpClient.interceptors.request.use(async (config) => {
  const token = await authTokenStorage.getToken();

  if (token) {
    if (authTokenStorage.isTokenExpired(token)) {
      await authTokenStorage.removeToken();
      await unauthorizedHandler?.();
      throw toApiError({ isAxiosError: true, response: { status: 401 } });
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      await authTokenStorage.removeToken();
      await unauthorizedHandler?.();
    }

    return Promise.reject(toApiError(error));
  }
);

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await httpClient.request<T | ApiResponse<T>>(config);
  const payload = response.data;

  if (
    payload
    && typeof payload === "object"
    && !Array.isArray(payload)
    && "success" in payload
  ) {
    const envelope = payload as ApiResponse<T>;

    if (!envelope.success) {
      throw new ApiError(envelope.message);
    }

    return envelope.data;
  }

  return payload as T;
};
