import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
