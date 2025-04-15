import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
