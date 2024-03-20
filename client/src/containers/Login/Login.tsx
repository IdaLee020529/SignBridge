import "./login.css";
import { useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { gapi } from "gapi-script";

// used to decode the credentials from the google token
import { jwtDecode } from "jwt-decode";
import type { GoogleCredentialResponse } from "@react-oauth/google";
import axios from "axios";

const clientId =
  "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function Login() {
  useEffect(() => {
    function initGapi() {
      gapi.client.init({
        clientId: clientId,
        scope: "email profile",
      });
    }
    gapi.load("client:auth2", initGapi);
  });

  const [email, setEmail] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const onSuccess = (res: GoogleCredentialResponse) => {
    console.log("Login Success: currentUser:", res);

    const decoded = jwtDecode(res.credential as string);
    console.log(decoded);
  };

  const onFailure = () => {
    console.log("Login failed");
  };

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log("Login Success: currentUser:", credentialResponse);
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

          <div className="login-form-group">
            <input type="email" placeholder=" " value={email} onChange={handleEmailChange} />
            <label htmlFor="inp" className="login-form-label">Email</label>
          </div>

          <div className="login-form-group">
            <input type="password" placeholder=" " value={password} onChange={handlePasswordChange} />
            <label htmlFor="inp" className="login-form-label">Password</label>
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
