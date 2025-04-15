import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "./environments";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

export const apiClient = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

let token: string | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setClerkToken = async (clerk: any) => {
  const accessToken = (await clerk.session.getToken()) as string;
  if (accessToken) {
    token = accessToken;
  }
};

apiClient.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
