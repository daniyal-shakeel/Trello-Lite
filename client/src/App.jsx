import { useState } from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Activity from "./pages/activity/Activity";
import AuthRoute from "./guards/AuthRoute";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const App = () => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/check-auth`,
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log(res.data.message);
        setAuth(true);
        setUser(res.data.user);
      } else {
        console.log(res.data.message);
        setAuth(false);
      }
    } catch (error) {
      console.log(
        "An error occured in checkAuth function at App.jsx file",
        error.message
      );
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute auth={auth}>
              <Dashboard user={user} setAuth={setAuth} />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <Login
              auth={auth}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              failureMessage={failureMessage}
              setFailureMessage={setFailureMessage}
            />
          }
        />
        <Route
          path="/activity-logs"
          element={
            <AuthRoute auth={auth}>
              <Activity />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
