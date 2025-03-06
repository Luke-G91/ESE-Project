import axios from "axios";
import LoginRequest from "./models/auth/LoginRequest";
import RegisterRequest from "./models/auth/RegisterRequest";
import UserViewModel from "./models/user/UserViewModel";

const baseUrl = import.meta.env.VITE_API_URL;

export const login = async (data: LoginRequest) => {
  const response = await axios.post(`${baseUrl}/login`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await axios.post(`${baseUrl}/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<UserViewModel> => {
  const response = await axios.get(`${baseUrl}/userInfo`, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(
    `${baseUrl}/logout`,
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};
