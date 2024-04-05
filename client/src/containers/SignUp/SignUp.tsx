import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { gapi } from "gapi-script";
// used to decode the credentials from the google token
import axios from "axios";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function SignUp() {
  const navigate = useNavigate();  // For the redirection

  // ---------- Define the variables ----------
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

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

  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setconfirmPassword(e.target.value);
  };

    // ---------- Toggle password visibility ----------
    const handleTogglePassword = () => {
      setShowPassword(!showPassword); // Toggle password visibility
    };

    const handleToggleConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword); // Toggle password visibility
    }

  // ---------- Validations ----------
  const validateUsername = () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false;
    }
    setUsernameError("");
    return true;
  };
  
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
  
  const validateConfirmPassword = () => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Confirm password does not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  // ---------- Handle form submission ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      const data = {
        username,
        email,
        password
      };

      try {
        await axios.post("http://localhost:3000/users-sign-up-auth", data);
        navigate("/login");
      } catch (error: any) {
        alert(error.response.data.error);
        console.error("Error registering user:", error);
      }

    } else {
      let errorMessage = '';
      if (!isUsernameValid) errorMessage += `- ${usernameError}\n`;
      if (!isEmailValid) errorMessage += `- ${emailError}\n`;
      if (!isPasswordValid) errorMessage += `- ${passwordError}\n`;
      if (!isConfirmPasswordValid) errorMessage += `- ${confirmPasswordError}\n`;

      alert("Form validation failed:\n" + errorMessage);
    }
  };

  // ---------- Initialize the google client ----------
  useEffect(() => {
    function initGapi() {
      gapi.client.init({
        clientId: clientId,
        scope: "email profile",
      });
    }
    gapi.load("client:auth2", initGapi);
  });

  // ---------- Used for the google sign up button ----------
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

        const registerUser = await axios.post("http://localhost:3000/users-google-auth", res.data);
        console.log(registerUser);
        navigate("/");

      } catch (e) {
        console.error(e);
      }
    },
    onError: () => {
      console.log("Signup failed");
    },
  });

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <div className="sign-up-form">
        <form onSubmit={handleSubmit}>

          <div className={`sign-up-form-group ${usernameError ? 'error' : ''}`}>
            <input type="text" placeholder=" " value={username} onChange={handleUsernameChange} onBlur={validateUsername}/>
            <label htmlFor="inp" className="sign-up-form-label">Username</label>
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>

          <div className={`sign-up-form-group ${emailError ? 'error' : ''}`}>
            <input type="email" placeholder=" " value={email} onChange={handleEmailChange} onBlur={validateEmail} />
            <label htmlFor="inp" className="sign-up-form-label">Email</label>
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className={`sign-up-form-group ${passwordError ? 'error' : ''}`}>
            <input type={showPassword ? "text" : "password"} placeholder=" " value={password} onChange={handlePasswordChange} onBlur={validatePassword} />
            <label htmlFor="inp" className="sign-up-form-label">Password</label>
            {passwordError && <div className="error-message">{passwordError}</div>}

            <button type="button" className="password-toggle" onClick={handleTogglePassword}>
              {showPassword ? <img src="./images/password-shown.png" alt="show-password" className="eye-icon" /> : <img src="./images/password-hidden.png" alt="hide-password" className="eye-icon" />}
            </button>
          </div>

          <div className={`sign-up-form-group ${confirmPasswordError ? 'error' : ''}`}>
            <input type={showConfirmPassword ? "text" : "password"} placeholder=" " value={confirmPassword} onChange={handleConfirmPasswordChange} onBlur={validateConfirmPassword}/>
            <label htmlFor="inp" className="sign-up-form-label">Confirm Password</label>
            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}

            <button type="button" className="password-toggle" onClick={handleToggleConfirmPassword}>
              {showConfirmPassword ? <img src="./images/password-shown.png" alt="show-password" className="eye-icon" /> : <img src="./images/password-hidden.png" alt="hide-password" className="eye-icon" />}
            </button>
          </div>

          <button className="sign-up-btn" type="submit">Sign Up</button>

          <div>or</div>

          <button className="google-sign-up-btn" type="button" onClick={() => login()} >
            <img src="/images/google-logo.png" alt="Google Logo" className="google-logo" />
            Sign Up with Google
          </button>

          <div className="login-link">
            <div>Already have an account?</div> <a href="/login">Login Here</a>
          </div>

        </form>
      </div>
    </div>
  );
}

export default SignUp;