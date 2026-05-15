import { AxiosError } from "axios";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NETWORK"
  | "UNKNOWN";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(message: string, code: ApiErrorCode = "UNKNOWN", status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

const statusToCode = (status?: number): ApiErrorCode => {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 400 || status === 422) return "VALIDATION";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  return "UNKNOWN";
};

const fallbackByCode: Record<ApiErrorCode, string> = {
  UNAUTHORIZED: "Sua sessão expirou. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para executar esta ação.",
  VALIDATION: "Verifique os dados informados.",
  NOT_FOUND: "Recurso não encontrado.",
  CONFLICT: "Não foi possível concluir a operação com os dados atuais.",
  NETWORK: "Servidor indisponível. Verifique sua conexão.",
  UNKNOWN: "Não foi possível concluir a operação.",
};

const getSafeMessage = (value: unknown): string | null => {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const message = data.message ?? data.error;

  return typeof message === "string" && message.length <= 160
    ? message
    : null;
};

export const toApiError = (
  error: unknown,
  fallback = fallbackByCode.UNKNOWN
): ApiError => {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError;
  const status = axiosError.response?.status;

  if (axiosError.isAxiosError) {
    if (!axiosError.response) {
      return new ApiError(fallbackByCode.NETWORK, "NETWORK");
    }

    const code = statusToCode(status);
    const message = getSafeMessage(axiosError.response.data)
      ?? fallbackByCode[code]
      ?? fallback;

    return new ApiError(message, code, status);
  }

  return new ApiError(fallback);
};

export const getUiErrorMessage = (
  error: unknown,
  fallback = fallbackByCode.UNKNOWN
): string => {
  return toApiError(error, fallback).message;
};
