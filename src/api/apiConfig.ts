import { Platform } from "react-native";

const developmentBaseUrls = Platform.select({
  android: "http://192.168.0.13:8080/api",
  ios: "http://192.168.0.13:8080/api",
  default: "http://192.168.0.13:8080/api",
});

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

const assertValidBaseUrl = (baseUrl: string): string => {
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error("EXPO_PUBLIC_API_URL deve ser uma URL válida.");
  }

  if (!__DEV__ && url.protocol !== "https:") {
    throw new Error("EXPO_PUBLIC_API_URL deve usar HTTPS em produção.");
  }

  return baseUrl.replace(/\/+$/, "");
};

export const API_BASE_URL = assertValidBaseUrl(
  configuredBaseUrl || developmentBaseUrls || "http://localhost:3000/api"
);

