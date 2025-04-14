import { login, UserDetails } from "@/queries/auth";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_MUTATION_KEY } from "../../constants";
import { toast } from "sonner";
import { getErrorMessage } from "@/helpers/errorHandler";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const hasLoggedIn = useRef(false);

  console.log("User::", user);

  const { mutate: loginUser } = useMutation({
    mutationKey: [LOGIN_MUTATION_KEY],
    mutationFn: (userDetails: UserDetails) => login(userDetails),
    onSuccess: () => {},
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasLoggedIn.current) {
      hasLoggedIn.current = true;
      loginUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        fullName: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [isLoaded, isSignedIn, user, loginUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
