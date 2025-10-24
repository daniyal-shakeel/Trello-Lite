import { MoveRightIcon, Eye, EyeOff } from "lucide-react";
import "./Login.css";
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Message from "../../components/ui/message/Message";
import { getApiUri, getRedirectUri } from "../../utils/getUri";

const Login = ({ auth }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const register = searchParams.get("register");

  const [activeTab, setActiveTab] = useState(
    register === "true" ? "register" : "login"
  );
  const [eye, setEye] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);

  const [loading, setLoading] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSwitchTab = (tab) => setActiveTab(tab);

  const handleEyeClick = () => setEye((prev) => !prev);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") {
      setPassword(value);
      validatePassword(value);
    }
  };

  const validatePassword = (pwd) => {
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const hasMinLength = pwd.length >= 8;

    if (!hasLower) {
      setPasswordMessage("At least one lowercase letter required");
      return setIsPasswordStrong(false);
    }
    if (!hasUpper) {
      setPasswordMessage("At least one uppercase letter required");
      return setIsPasswordStrong(false);
    }
    if (!hasNumber) {
      setPasswordMessage("At least one number required");
      return setIsPasswordStrong(false);
    }
    if (!hasSpecial) {
      setPasswordMessage("At least one special character required");
      return setIsPasswordStrong(false);
    }
    if (!hasMinLength) {
      setPasswordMessage("Password must be at least 8 characters long");
      return setIsPasswordStrong(false);
    }

    setPasswordMessage("Strong password. You can move on");
    setIsPasswordStrong(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = activeTab === "register" ? "signup" : "login";

    const payload =
      activeTab === "register"
        ? { name, email, password }
        : { email, password };

    try {
      const res = await axios.post(
        getApiUri(`/api/user/${endpoint}`),
        { ...payload },
        { withCredentials: true }
      );

      if (res.data.success) {
        setName("");
        setEmail("");
        setPassword("");
        setPasswordMessage("");
        setIsPasswordStrong(false);

        if (activeTab === "register") {
          setSuccessMessage("Account created successfully! Please log in.");
          setFailureMessage("");
          setActiveTab("login");
        } else {
          setSuccessMessage("Logged in successfully!");
          setFailureMessage("");
          window.location.href = getRedirectUri("/dashboard");
        }
      } else if (res.data.redirect) {
        navigate(`/login?error=${encodeURIComponent(res.data.message.toString())}`);
      } else {
        setFailureMessage(res.data.message || "Something went wrong.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.log(error.message);
      setFailureMessage("Server error. Please try again later.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error");
    if (error) setFailureMessage(error);
  }, [location.search]);

  if (auth) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div id="login" className="login">
      <div id="login-container" className="login-container">
        <h1 className="login__brand">TrelloLite</h1>
        <h1 className="login__title">
          {activeTab === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="login__subtitle">
          {activeTab === "login"
            ? "Sign in to continue organizing your tasks."
            : "Start managing tasks with a few quick steps."}
        </p>

        {failureMessage && <Message type="failure" text={failureMessage} />}
        {successMessage && <Message type="success" text={successMessage} />}

        <div id="login-switch" className="login__switch">
          <button
            onClick={() => handleSwitchTab("login")}
            className={`login__switch-button ${activeTab === "login" ? "login__switch-button--active" : ""
              }`}
          >
            Log in
          </button>

          <button
            onClick={() => handleSwitchTab("register")}
            className={`login__switch-button ${activeTab === "register" ? "login__switch-button--active" : ""
              }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} id="login-form" className="login__form">
          {activeTab === "register" && (
            <>
              <label htmlFor="name" className="login__label">
                Name
              </label>
              <input
                onChange={handleOnChange}
                type="text"
                name="name"
                id="name"
                className="login__input"
                placeholder="John Doe"
                value={name}
              />
            </>
          )}

          <label htmlFor="email" className="login__label">
            Email
          </label>
          <input
            onChange={handleOnChange}
            type="email"
            name="email"
            id="email"
            className="login__input"
            placeholder="you@example.com"
            value={email}
          />

          <label htmlFor="password" className="login__label">
            Password
          </label>
          <div className="login__input-container">
            <input
              onChange={handleOnChange}
              type={eye ? "text" : "password"}
              name="password"
              id="password"
              className="login__input"
              placeholder="••••"
              value={password}
            />
            {eye ? (
              <Eye onClick={handleEyeClick} className="login__input-eye" />
            ) : (
              <EyeOff onClick={handleEyeClick} className="login__input-eye" />
            )}
          </div>
          {password && activeTab !== "login" && (
            <p
              className={`login__password-hint ${isPasswordStrong
                ? "login__password-strong"
                : "login__password-weak"
                }`}
            >
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            className="login__submit"
            disabled={
              loading ||
              (activeTab === "register" &&
                (!isPasswordStrong || email === "" || name === "")) ||
              (activeTab === "login" && (email === "" || password === ""))
            }
          >
            <MoveRightIcon className="login__submit-icon" />
            <span className="login__submit-text">
              {loading
                ? activeTab === "login"
                  ? "Logging in..."
                  : "Creating your account..."
                : activeTab === "login"
                  ? "Log in"
                  : "Create account"}
            </span>
          </button>
        </form>

        <div className="login__divider">or</div>

        <button
          type="button"
          className="login__oauth"
          onClick={() =>
            (window.location.href = `${import.meta.env.VITE_SERVER_URL}/google`)
          }
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
