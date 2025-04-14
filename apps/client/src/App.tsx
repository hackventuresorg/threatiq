import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/generic/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Introduction/Home";
import { useUser } from "@clerk/clerk-react";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const { user } = useUser();

  console.log("User::", user);

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
