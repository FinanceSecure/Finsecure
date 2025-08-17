import { TokenService } from "@/services/authService";
import { Slot, usePathname, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
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
      const publicRoutes = ["/auth/login", "/auth/cadastrar"];

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
        if (Date.now() >= exp * 1000) {
          await TokenService.removeToken();
          router.replace("/auth/login");
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao decodificar o token", error);
        await TokenService.removeToken();
        router.replace("/auth/login");
        return;
      }
    }

    checkAuth();
  }, [pathName]);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
