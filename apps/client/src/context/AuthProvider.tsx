import { useEffect, useState, ReactNode, useCallback } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { login, UserDetails } from "@/queries/auth";
import { LOGIN_MUTATION_KEY } from "../constants";
import { setClerkToken } from "@/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/helpers/errorHandler";
import { AuthContext } from "./AuthContextStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { mutate: loginUser, isPending: isLoginLoading } = useMutation({
    mutationKey: [LOGIN_MUTATION_KEY],
    mutationFn: (userDetails: UserDetails) => login(userDetails),
    onSuccess: () => {
      setIsAuthenticated(true);
    },
    onError: (error: unknown) => {
      setIsAuthenticated(true);
      toast.error(getErrorMessage(error));
    },
  });

  const handleUserLogin = useCallback(() => {
    if (!user || !clerk || isInitialized) return;

    setIsInitialized(true);

    setClerkToken(clerk).then(() => {
      loginUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        fullName: `${user.firstName} ${user.lastName}`,
      });
    });
  }, [user, clerk, isInitialized, loginUser]);

  useEffect(() => {
    if (isLoaded && isSignedIn && !isInitialized) {
      handleUserLogin();
    } else if (isLoaded && !isSignedIn) {
      setIsAuthenticated(false);
      setIsInitialized(false);
    }
  }, [isLoaded, isSignedIn, handleUserLogin, isInitialized]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isSignedIn || isAuthenticated,
        isAuthLoading: !isLoaded || isLoginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
