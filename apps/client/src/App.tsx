import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ui/protectedRoute";
import AuthCallback from "./pages/auth/auth-callback";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Introduction/Home";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<><Button/></>}/>
        </Route>
        <Route path="/auth-callback" element={<AuthCallback/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
