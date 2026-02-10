import axios from "axios";

const API_URL = import.meta.env.VITE_DJANGO_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post("/auth/token/", { username, password });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post("/auth/register/", {
    username,
    email,
    password,
  });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post("/auth/password-reset/", { email });
  return response.data;
};

export const confirmPasswordReset = async (token, newPassword) => {
  const response = await api.post("/auth/password-reset-confirm/", {
    token,
    new_password: newPassword,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getTodos = async () => {
  const response = await api.get("/todos/");
  return response.data;
};

export const createTodo = async (name) => {
  const response = await api.post("/todos/", { name });
  return response.data;
};

export const updateTodo = async (id, data) => {
  const response = await api.patch(`/todos/${id}/`, data);
  return response.data;
};

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}/`);
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/auth/profile/", data);
  return response.data;
};

export default api;
