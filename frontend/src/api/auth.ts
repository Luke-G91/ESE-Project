import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${baseUrl}/login`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const register = async (data: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await axios.post(`${baseUrl}/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getCurrentUser = async () => {
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
