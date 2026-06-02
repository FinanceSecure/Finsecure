import { request } from "@/api/httpClient";
import { authTokenStorage } from "@/storage/authTokenStorage";
import { AuthResponse, LoginDTO, RegisterDTO, UserTokenData } from "./auth.types";

export const authService = {
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: "POST",
      url: "/usuarios/login",
      data,
    });
  },

  register: async (data: RegisterDTO): Promise<void> => {
    await request<unknown>({
      method: "POST",
      url: "/usuarios/cadastrar",
      data,
    });
  },

  changeEmail: async (email: string): Promise<void> => {
    await request<unknown>({
      method: "PUT",
      url: "/usuarios/alterar-email",
      data: { email },
    });
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await request<unknown>({
      method: "PUT",
      url: "/usuarios/alterar-senha",
      data: { oldPassword, newPassword },
    });
  },

  deleteAccount: async (): Promise<void> => {
    await request<unknown>({
      method: "DELETE",
      url: "/usuarios/apagar-conta",
    });
  },

  setToken: authTokenStorage.setToken,
  getToken: authTokenStorage.getToken,
  removeToken: authTokenStorage.removeToken,

  getUserFromToken: async (): Promise<UserTokenData | null> => {
    const payload = await authTokenStorage.getPayload();
    if (!payload?.name || !(payload.userId || payload.sub)) return null;

    return {
      name: payload.name,
      userId: payload.userId || payload.sub || "",
    };
  },
};
