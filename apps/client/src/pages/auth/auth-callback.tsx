import { login, UserDetails } from "@/queries/auth";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getError } from "@/helpers/errorHandler";

export default function AuthCallback() {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();

  console.log("This is fallback..............");

  useEffect(() => {
    const saveUser = async () => {
      if (isLoaded && user) {
        try {
          const userDetails: UserDetails = {
            clerkId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress?.emailAddress,
            imageUrl: user.imageUrl,
            fullName: user.fullName,
          };

          await login(userDetails);
          navigate("/dashboard", { replace: true });
        } catch (error) {
          console.error("Login error:", getError(error));
          navigate("/login", { replace: true });
        }
      } else if (isLoaded && !isSignedIn) {
        navigate("/login", { replace: true });
      }
    };
    saveUser();
  }, [isLoaded, user, isSignedIn, navigate]);

  return <div className="h-screen flex justify-center items-center">Loading...</div>;
}
