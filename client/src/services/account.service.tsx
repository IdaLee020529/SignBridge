import axios from "axios";
import { GOOGLE } from "../constants/account.constant";

// ---------- Sign Up User ----------
export const SignUpUser = async (data: any) => {
  try {
    const registerUser = await axios.post(
      "http://localhost:3000/users/signup",
      data
    );
    return registerUser;
  } catch (err) {
    throw err;
  }
};

export const SignUpUserGoogle = async (data: any) => {
  try {
    const loginUser = await axios.post(
      "http://localhost:3000/users/google/signup",
      data
    );
    return loginUser;
  } catch (err) {
    throw err;
  }
};

export const LoginUserGoogle = async (data: any) => {
  try {
    const loginUser = await axios.post(
      "http://localhost:3000/users/google/login",
      data
    );
    return loginUser;
  } catch (err) {
    throw err;
  }
};

export const FetchGoogleData = async (token: string) => {
  try {
    const response = await axios.get(GOOGLE.GOOGLELAPIS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Login User ----------
export const LoginUser = async (data: any) => {
  try {
    const loginUser = await axios.post(
      "http://localhost:3000/users/login",
      data
    );
    return loginUser;
  } catch (err) {
    throw err;
  }
};


export const LogoutUser = async (data: any) => {
  try {
    const logoutUser = await axios.post(
      "http://localhost:3000/users/logout",
      data
    );
    return logoutUser;
  } catch (err) {
    throw err;
  }
}


// ---------- Forgot Password ----------
export const UserForgotPassword = async (data: any) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/users/forget-password",
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Reset Password ----------
export const UserResetPassword = async (data: any) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/users/reset-password",
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

//  ---------- Get User by email ----------
export const GetUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/users/${email}`);
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Update profile info by user_id ----------
export const UpdateProfileInfo = async ( email:string,  data: FormData) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/users/${email}/profile`,
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// ---------- Fetch All Countries ----------
export const FetchAllCountries = async () => {
  try {
    const response = await axios.get("http://localhost:3000/users/countries");
    return response;
  } catch (err) {
    throw err;
  }
};