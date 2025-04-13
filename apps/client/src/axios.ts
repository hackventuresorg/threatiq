import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
})

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
})