import Constants from "expo-constants";

const apiHost = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${apiHost}:5000`;

export function getFilmeImageUrl(imagem: string | null): string | null {
  return imagem ? `${API_URL}${imagem}` : null;
}
