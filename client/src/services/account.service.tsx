import axios from "axios";
import { GOOGLE } from "../constants/account.constant";

export const LoginUser = async (data: any) => {
  try {
    const loginUser = await axios.post(GOOGLE.GOOGLELAPIS, data);
    return loginUser;
  } catch (err) {
    throw err;
  }
};
