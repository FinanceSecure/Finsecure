import { LoadingState } from "@/components/Feedback/LoadingState";
import { AuthProvider, useAuth } from "@/modules/auth/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const publicRoutes = ["/auth/login", "/auth/register", "/legal/privacy"];

function ProtectedStack() {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useAuth();
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "anonymous" && !isPublicRoute) {
      router.replace("/auth/login");
      return;
    }

    if (status === "authenticated" && isPublicRoute) {
      router.replace("/(tabs)");
    }
  }, [isPublicRoute, pathname, router, status]);

  if (status === "loading") {
    return <LoadingState />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="investments/[id]" />
      <Stack.Screen name="investments/redeem/[id]" />
      <Stack.Screen name="legal/privacy" />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  }));

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProtectedStack />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
