import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { useTheme } from "../../store/theme";
import { COLOR_ROLE_ACCESS } from "../../constants/account.constant";
import {
  LoginUser,
  FetchGoogleData,
  SignUpLoginUserGoogle,
} from "../../services/account.service";
import LoginInput from "../../components/LoginInput/LoginInput";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate(); // For the redirection

  // Detect cookies, if yes, redirect user to homepage
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // ---------- Define the variables ----------
  const { updateColors } = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  // ---------- Toggle password visibility ----------
  const handleTogglePassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  // ---------- Validations ----------
  const validateEmail = (value: string) => {
    let error = "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value.trim()) {
      error = "Email is required";
      setEmailError("Email is required");
      return error;
    } else if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return error;
    }
    setEmailError("");
    return error;
  };

  const validatePassword = (value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "Password is required";
      setPasswordError("Password is required");
      return error;
    } else if (password.length < 5) {
      error = "Password must be at least 6 characters long";
      setPasswordError("Password must be at least 6 characters long");
      return error;
    }
    setPasswordError("");
    return error;
  };

  // ---------- Handle form submission ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailErrors = validateEmail(email);
    const passwordErrors = validatePassword(password);

    let errorMessage = "";
    if (emailErrors.length > 0) errorMessage += `- ${emailErrors}\n`;
    if (passwordErrors.length > 0) errorMessage += `- ${passwordErrors}\n`;

    if (emailErrors.length === 0 && passwordErrors.length === 0) {
      const data = {
        email,
        password,
      };

      try {
        const loginUserResponse = await LoginUser(data);
        const loginUser = loginUserResponse.data;

        // save the token in the cookies with name "token"
        document.cookie = `token=${loginUser.token}`;
        document.cookie = `name=${loginUser.username}`;
        document.cookie = `email=${data.email}`;
        document.cookie = `picture=${loginUser.picture}`;
        document.cookie = `role_access=${loginUser.role_access}`;

        if (loginUser.role_access === "admin") {
          localStorage.setItem("color", COLOR_ROLE_ACCESS.admin.color);
          updateColors(COLOR_ROLE_ACCESS.admin.color);
        } else if (loginUser.role_access === "signexpert") {
          localStorage.setItem("color", COLOR_ROLE_ACCESS.signexpert.color);
          updateColors(COLOR_ROLE_ACCESS.signexpert.color);
        } else {
          localStorage.setItem("color", COLOR_ROLE_ACCESS.public.color);
          updateColors(COLOR_ROLE_ACCESS.public.color);
        }
        navigate("/");
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.error("Error Login user:", error);
      }
    } else {
      toast.error("Form validation failed:\n" + errorMessage);
    }
  };

  // ---------- Google Login ----------
  useEffect(() => {
    function initGapi() {
      gapi.client.init({
        clientId: clientId,
        scope: "email profile",
      });
    }
    gapi.load("client:auth2", initGapi);
  });

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        // save the token in the cookies with name "token"
        document.cookie = `token=${credentialResponse.access_token}`;

        const res = await FetchGoogleData(credentialResponse.access_token);

        // save the name into the cookies
        Cookies.set("name", res.data.name);
        Cookies.set("email", res.data.email);
        Cookies.set("picture", res.data.picture);
        Cookies.set("role_access", res.data.role_access);

        SignUpLoginUserGoogle(res.data);
        navigate("/");
      } catch (e) {
        console.error(e);
      }
    },
    onError: () => {
      console.log("Login failed");
    },
  });

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <LoginInput
            type="email"
            placeholder=" "
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            label="Email"
          />

          <LoginInput
            type={showPassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            label="Password"
            showPassword={showPassword}
            handleTogglePassword={handleTogglePassword}
          />

          <div className="forgot-pwd-container">
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

          <div>or</div>

          <button
            className="google-login-btn"
            type="button"
            onClick={() => login()}
          >
            <img
              src="/images/google-logo.png"
              alt="Google Logo"
              className="google-logo"
            />
            Login with Google
          </button>

          <div className="sign-up">
            <div>Don't have an account?</div> <a href="/sign-up">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
