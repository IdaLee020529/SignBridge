import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { useThemeStore } from "../../store/theme";
import { COLOR_ROLE_ACCESS } from "../../constants/account.constant";
import {
  LoginUser,
  FetchGoogleData,
  SignUpUserGoogle,
  LoginUserGoogle,
} from "../../services/account.service";
import LoginInput from "../../components/LoginInput/LoginInput";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate(); // For the redirection
  const { t, i18n } = useTranslation();

  // Detect cookies, if yes, redirect user to homepage
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // ---------- Define the variables ----------
  const { updateColors } = useThemeStore();

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
        Cookies.set("token", loginUser.token, { expires: 7 });
        Cookies.set("user_id", loginUser.user_id, { expires: 7 });
        Cookies.set("name", loginUser.username, { expires: 7 });
        Cookies.set("email", data.email, { expires: 7 });
        Cookies.set("picture", loginUser.picture, { expires: 7 });
        Cookies.set("role_access", loginUser.role_access, { expires: 7 });

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
        const res = await FetchGoogleData(credentialResponse.access_token);

        // save the name into the cookies
        Cookies.set("token", res.data.token, { expires: 30 });
        Cookies.set("name", res.data.name, { expires: 30 });
        Cookies.set("email", res.data.email, { expires: 30 });
        Cookies.set("picture", res.data.picture, { expires: 30 });

        await SignUpUserGoogle(res.data);

        const loginResponse = await LoginUserGoogle(res.data);
        console.log("loginResponse", loginResponse);
        Cookies.set("user_id", loginResponse.data.user_id, { expires: 30 });
        Cookies.set("role_access", loginResponse.data.role_access, {
          expires: 30,
        });

        // SignUpUserGoogle(res.data);
        toast.success("Google login successful");
        navigate("/");
      } catch (e) {
        console.error(e);
        toast.error("Google login failed");
      }
    },
    onError: () => {
      console.log("Login failed");
      toast.error("Google login failed");
    },
  });

  return (
    <div className="login-container">
      <h1>{t("login")}</h1>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <LoginInput
            type="email"
            placeholder=" "
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            label={t("email")}
          />

          <LoginInput
            type={showPassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            label={t("password")}
            showPassword={showPassword}
            handleTogglePassword={handleTogglePassword}
          />

          <div className="forgot-pwd-container">
            <a href="/forgot-password" className="forgot-password">
              {t("forgot_password")}
            </a>
          </div>

          <button className="login-btn" type="submit">
            {t("login")}
          </button>

          <div>{t("or")}</div>

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
            {t("login_with_google")}
          </button>

          <div className="sign-up">
            <div>{t("no_account")}</div> <a href="/sign-up">{t("sign_up")}</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
