import { MoveRightIcon } from "lucide-react";
import "./Login.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const register = searchParams.get("register");
  
  const [activeTab, setActiveTab] = useState(register ? "register" : "login");

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div id="login" className="login">
      <div id="login-container" className="login-container">
        {/* Brand / Heading */}
        <h1 className="login__brand">TrelloLite</h1>
        <h1 className="login__title">
          {activeTab === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="login__subtitle">
          {activeTab === "login"
            ? "Sign in to continue organizing your tasks."
            : "Start managing tasks with a few quick steps."}
        </p>

        {/* CTA Switch */}
        <div id="login-switch" className="login__switch">
          <button
            onClick={() => handleSwitchTab("login")}
            className={`login__switch-button ${
              activeTab === "login" ? "login__switch-button--active" : ""
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => handleSwitchTab("register")}
            className={`login__switch-button ${
              activeTab === "register" ? "login__switch-button--active" : ""
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        <form id="login-form" className="login__form">
          {activeTab === "register" && (
            <>
              <label htmlFor="name" className="login__label">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="login__input"
                placeholder="John Doe"
              />
            </>
          )}

          <label htmlFor="email" className="login__label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="login__input"
            placeholder="you@example.com"
          />

          <label htmlFor="password" className="login__label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="login__input"
            placeholder="••••"
          />

          <button type="submit" className="login__submit">
            <MoveRightIcon className="login__submit-icon" />
            <span className="login__submit-text">
              {activeTab === "login" ? "Log in" : "Create account"}
            </span>
          </button>

          <p className="login__divider">or</p>

          <button type="button" className="login__oauth login__oauth--google">
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;