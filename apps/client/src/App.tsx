import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/generic/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Introduction/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import Organization from "./pages/dashboard/Organization";
import Threat from "./pages/dashboard/Threat";
import {io, Socket} from "socket.io-client";
import { SOCKET_IO_URL } from "./environments";

const socket: Socket = io(SOCKET_IO_URL);
function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organization/:orgId" element={<Organization />} />
          <Route path="/cctv/:cctvId" element={<Threat socket={socket} />} />
        </Route>
        <Route
          path="*"
          element={<div className="flex justify-center items-center h-[80vh]">404</div>}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
