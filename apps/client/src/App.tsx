import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/generic/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Introduction/Home";
import { useUser, useClerk } from "@clerk/clerk-react";
import Dashboard from "./pages/dashboard/Dashboard";
import { useEffect } from "react";
import { setClerkToken } from "./axios";

function App() {
  const { user } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (user && clerk) {
      setClerkToken(clerk);
    }
  }, [clerk, user]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route
          path="*"
          element={<div className="flex justify-center items-center h-[80vh]">404</div>}
        />
      </Routes>
    </>
  );
}

export default App;
