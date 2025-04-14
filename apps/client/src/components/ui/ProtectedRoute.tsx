import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
    