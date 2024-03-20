import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { gapi } from "gapi-script";
// used to decode the credentials from the google token
import { jwtDecode } from "jwt-decode";
import type { GoogleCredentialResponse } from "@react-oauth/google";
import axios from "axios";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    function initGapi() {
      gapi.client.init({
        clientId: clientId,
        scope: "email profile",
      });
    }
    gapi.load("client:auth2", initGapi);
  });

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
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setconfirmPassword(e.target.value);
  };

  // validations
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form fields
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    // Submit form if all fields are valid
    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      console.log("Form submitted");
      // Proceed with form submission
    } else if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid){
      let errorMessage = '';
      if (!isUsernameValid) errorMessage += `- ${usernameError}\n`;
      if (!isEmailValid) errorMessage += `- ${emailError}\n`;
      if (!isPasswordValid) errorMessage += `- ${passwordError}\n`;
      if (!isConfirmPasswordValid) errorMessage += `- ${confirmPasswordError}\n`;

      // Show alert with error message
      alert("Form validation failed:\n" + errorMessage);
    }
  };

  const onSuccess = (res: GoogleCredentialResponse) => {
    console.log("Sign Up Success: currentUser:", res);

    const decoded = jwtDecode(res.credential as string);
    console.log(decoded);
    
  };

  const onFailure = () => {
    console.log("Sign Up failed");
  };

  // Used for the google sign up button
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log("Sign Up Success: currentUser:", credentialResponse);
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
            },
          }
        );
        console.log(res);

        const registerUser = await axios.post("http://localhost:3000/users-google-auth", res.data);
        console.log(registerUser);
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
            <input type="password" placeholder=" " value={password} onChange={handlePasswordChange} onBlur={validatePassword} />
            <label htmlFor="inp" className="sign-up-form-label">Password</label>
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className={`sign-up-form-group ${confirmPasswordError ? 'error' : ''}`}>
            <input type="password" placeholder=" " value={confirmPassword} onChange={handleConfirmPasswordChange} onBlur={validateConfirmPassword}/>
            <label htmlFor="inp" className="sign-up-form-label">Confirm Password</label>
            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
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
