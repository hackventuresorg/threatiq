import { Button } from "./components/ui/button";
import {Route, Routes} from 'react-router-dom'
import Login from "./pages/auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<><Button/></>}/>
      </Routes>
    </>
  );
}

export default App;
