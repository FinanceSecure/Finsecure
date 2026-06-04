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

if (!configuredBaseUrl) {
  throw new Error("EXPO_PUBLIC_API_URL deve ser configurada.");
}

export const API_BASE_URL = assertValidBaseUrl(configuredBaseUrl);
