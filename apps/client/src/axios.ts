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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setClerkToken = async (clerk: any) => {
  const token = (await clerk.session.getToken()) as string;

  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
