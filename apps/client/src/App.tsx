import { Button } from "./components/ui/button";
import {Route, Routes} from 'react-router-dom'
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ui/protectedRoute";
import AuthCallback from "./pages/auth/auth-callback";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<><Button/></>}/>
        </Route>
        <Route path="/auth-callback" element={<AuthCallback/>}/>
      </Routes>
    </>
  );
}

export default App;
