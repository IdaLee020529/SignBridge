import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
// used to decode the credentials from the google token
import { jwtDecode } from "jwt-decode";
import type { GoogleCredentialResponse } from "@react-oauth/google";
import axios from "axios";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate();  // For the redirection
  
  // this code will cause the login to fail
  // axios.defaults.withCredentials = true;  // For the session and cookies

  // ---------- Define the variables ----------
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // ---------- Toggle password visibility ----------
  const handleTogglePassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  // ---------- Validations ----------
  const validateEmail = () => {
    // You can use a regular expression to validate email format
    // Here's a simple example, you can use a more comprehensive one
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
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
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      const data = {
        email,
        password
      };

      try {
        const loginUser = await axios.post("http://localhost:3000/users-login-auth", data);

        // save the token in the cookies with name "token"
        document.cookie = `token=${loginUser.data.token}`;
        // save the name into the cookies
        document.cookie = `name=${loginUser.data.username}`;
        // save the email into the cookies
        document.cookie = `email=${data.email}`;
        // save the picture into the cookies
        document.cookie = `picture=${loginUser.data.picture}`;
        document.cookie = `role_access=${loginUser.data.role_access}`;

        navigate("/");
      } catch (error: any) {
        alert(error.response.data.error);
        console.error("Error registering user:", error);
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

        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
            },
          }
        );

        // save the name into the cookies
        document.cookie = `name=${res.data.name}`;
        document.cookie = `email=${res.data.email}`;
        document.cookie = `picture=${res.data.picture}`;
        document.cookie = `role_access=${res.data.role_access}`;

        console.log(res);
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

          <button className="google-login-btn" type="button" onClick={() => login()} >
            <img src="/images/google-logo.png" alt="Google Logo" className="google-logo" />
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