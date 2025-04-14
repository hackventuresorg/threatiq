import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const setClerkToken = (clerk: any) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${clerk.session.getToken()}`;
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
