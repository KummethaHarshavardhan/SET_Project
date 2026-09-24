import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    window.dispatchEvent(new Event("auth-changed"));
  }
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", {
    email: userData.email,
    password: userData.password,
  });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    window.dispatchEvent(new Event("auth-changed"));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-changed"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/auth/change-password", { currentPassword, newPassword });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", { email, otp, newPassword });
  return response.data;
};