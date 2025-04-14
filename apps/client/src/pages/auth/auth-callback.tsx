import { login } from "@/queries/auth";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const saveUser = async () => {
      if (isLoaded && user) {
        console.log("user", user);
        try {
          await login(user.id);
        } catch (error) {
          // will handle error later
          console.error("Login error:", error);
        } finally {
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
