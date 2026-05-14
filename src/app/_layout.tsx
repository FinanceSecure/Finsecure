import { TokenService } from "@data/services/authService";
import { Stack, usePathname, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface JwtPayload {
  exp: number;
}

export default function RootLayout() {
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const publicRoutes = ["/auth/login", "/auth/register"];
      if (publicRoutes.includes(pathName)) {
        setLoading(false);
        return;
      }

      const token = await TokenService.getToken();
      if (!token) {
        router.replace("/auth/login");
        setLoading(false);
        return;
      }

      try {
        const { exp } = jwtDecode<JwtPayload>(token);
        if (Date.now() >= exp * 1000) throw new Error("Token expirado");
        setLoading(false);
      } catch (error) {
        console.warn("Sessão inválida ou expirada");
        await TokenService.removeToken();
        router.replace("/auth/login");
      }
    }
    checkAuth();
  }, [pathName]);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
