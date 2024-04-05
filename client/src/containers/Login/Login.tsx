import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { useTheme } from "../../store/theme";
import axios from "axios";

// used to decode the credentials from the google token
import { jwtDecode } from "jwt-decode";
import type { GoogleCredentialResponse } from "@react-oauth/google";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate();  // For the redirection
  
  // this code will cause the login to fail
  // axios.defaults.withCredentials = true;  // For the session and cookies

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
  
  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError("");
    return true;
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
        const loginUser = await axios.post("http://localhost:3000/users-login-auth", data);

        // save the token in the cookies with name "token"
        document.cookie = `token=${loginUser.token}`;
        document.cookie = `name=${loginUser.username}`;
        document.cookie = `email=${data.email}`;
        // save the picture into the cookies
        document.cookie = `picture=${loginUser.data.picture}`;
        document.cookie = `role_access=${loginUser.data.role_access}`;

        if (loginUser.data.role_access === "admin") {
          localStorage.setItem('color', '#FCC003');
          updateColors("#FCC003");
        } else if (loginUser.data.role_access === "signexpert") {
          localStorage.setItem('color', '#5E6AC6');
          updateColors("#5E6AC6");
        } else {
          localStorage.setItem('color', '#1C2E4A');
          updateColors("#1C2E4A");
        }
        navigate("/");
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.error("Error Login user:", error);
      }

    } else {
      let errorMessage = '';
      if (!isEmailValid) errorMessage += `- ${emailError}\n`;
      if (!isPasswordValid) errorMessage += `- ${passwordError}\n`;
      
      alert("Form validation failed:\n" + errorMessage);
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
        Cookies.set('name', res.data.name);
        Cookies.set('email', res.data.email);
        Cookies.set('picture', res.data.picture);
        Cookies.set('role_access', res.data.role_access);
        
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

        <div className={`login-form-group ${emailError ? 'error' : ''}`}>
            <input type="email" placeholder=" " value={email} onChange={handleEmailChange} onBlur={validateEmail} />
            <label htmlFor="inp" className="login-form-label">Email</label>
            {emailError && <div className="login-error-message">{emailError}</div>}
          </div>

          <div className={`login-form-group ${passwordError ? 'error' : ''}`}>
            <input type={showPassword ? "text" : "password"} placeholder=" " value={password} onChange={handlePasswordChange} onBlur={validatePassword} />
            <label htmlFor="inp" className="login-form-label">Password</label>
            {passwordError && <div className="error-message">{passwordError}</div>}

            <button type="button" className="password-toggle" onClick={handleTogglePassword}>
              {showPassword ? <img src="./images/password-shown.png" alt="show-password" className="eye-icon" /> : <img src="./images/password-hidden.png" alt="hide-password" className="eye-icon" />}
            </button>
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
