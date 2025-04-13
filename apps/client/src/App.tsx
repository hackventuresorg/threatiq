import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Introduction/Home";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
