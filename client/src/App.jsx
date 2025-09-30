import { useState } from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AuthRoute from "./guards/AuthRoute";
import { Routes, Route } from "react-router-dom";

const App = () => {
  const [auth, setAuth] = useState(true);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute auth={auth}>
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
