import { getUiErrorMessage } from "@/api/apiError";
import { setUnauthorizedHandler } from "@/api/httpClient";
import { secureTokenStorage } from "@/storage/secureTokenStorage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "./auth.service";
import { LoginDTO, RegisterDTO, UserTokenData } from "./auth.types";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  user: UserTokenData | null;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserTokenData | null>(null);

  const clearSession = useCallback(async () => {
    await secureTokenStorage.removeToken();
    queryClient.clear();
    setUser(null);
    setStatus("anonymous");
  }, [queryClient]);

  const logout = useCallback(async () => {
    await clearSession();
    router.replace("/auth/login");
  }, [clearSession, router]);

  const refreshSession = useCallback(async () => {
    const token = await secureTokenStorage.getToken();

    if (!token || secureTokenStorage.isTokenExpired(token)) {
      await clearSession();
      return;
    }

    const tokenUser = await authService.getUserFromToken();
    setUser(tokenUser);
    setStatus("authenticated");
  }, [clearSession]);

  const login = useCallback(async (data: LoginDTO) => {
    const response = await authService.login(data);

    if (!response.token) {
      throw new Error("Resposta de autenticação inválida.");
    }

    await secureTokenStorage.setToken(response.token);
    await refreshSession();
  }, [refreshSession]);

  const register = useCallback(async (data: RegisterDTO) => {
    await authService.register(data);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearSession();
      router.replace("/auth/login");
    });

    refreshSession().catch(() => {
      clearSession();
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession, refreshSession, router]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    login,
    register,
    logout,
    refreshSession,
  }), [status, user, login, register, logout, refreshSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
};

export const getAuthErrorMessage = (error: unknown): string => {
  return getUiErrorMessage(error, "Não foi possível autenticar.");
};
