import axios from "axios";
import { GOOGLE } from "../constants/account.constants";

// ---------- Sign Up User ----------
export const SignUpUser = async (data: any) => {
  try {
    const registerUser = await axios.post('http://localhost:3000/users-sign-up-auth', data);
    return registerUser;
  } catch (err) {
    throw err;
  }
};

export const SignUpLoginUserGoogle = async (data: any) => {
  try {
    const loginUser = await axios.post("http://localhost:3000/users-google-auth", data);
    return loginUser;
  } catch (err) {
    throw err;
  }
};

export const FetchGoogleData = async (token: string) => {
  try {
    const response = await axios.get(
      GOOGLE.GOOGLELAPIS,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Login User ----------
export const LoginUser = async (data: any) => {
  try {
    const loginUser = await axios.post("http://localhost:3000/users-login-auth", data);
    return loginUser;
  } catch (err) {
    throw err;
  }
};

// ---------- Forgot Password ----------
export const UserForgotPassword = async (data: any) => {
  try {
    const response = await axios.post("http://localhost:3000/forgot-password", data);
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Reset Password ----------
export const UserResetPassword = async (data: any) => {
  try {
    const response = await axios.post("http://localhost:3000/reset-password", data);
    return response;
  } catch (err) {
    throw err;
  }
};

