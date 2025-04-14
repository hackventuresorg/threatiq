import { SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || isSignedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <SignIn redirectUrl='/dashboard'/>
    </div>
  );
}
