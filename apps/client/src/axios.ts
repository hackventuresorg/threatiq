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
let tokenClerk: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setClerkToken = async (clerk: any) => {
  tokenClerk = clerk;
  await refreshToken();
};

// Refresh token function to get a new token
const refreshToken = async () => {
  if (!tokenClerk) return;
  try {
    const accessToken = await tokenClerk.session.getToken();
    if (accessToken) {
      token = accessToken;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    token = null;
  }
};

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 and we haven't tried to refresh already
    if (error.response?.status === 401 && !originalRequest._retry && tokenClerk) {
      originalRequest._retry = true;
      try {
        // Try to refresh the token
        await refreshToken();
        // Update the header with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        // Retry the request
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(async (config) => {
  if (tokenClerk && tokenClerk.session) {
    try {
      const currentSession = tokenClerk.session;
      if (currentSession && currentSession.status === "active") {
        const lastRefresh = localStorage.getItem("lastTokenRefresh");
        const now = Date.now();
        if (!lastRefresh || now - parseInt(lastRefresh) > 5 * 60 * 1000) {
          await refreshToken();
          localStorage.setItem("lastTokenRefresh", now.toString());
        }
      } else {
        await refreshToken();
      }
    } catch (error) {
      console.error("Error checking session status:", error);
    }
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
