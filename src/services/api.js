import axios from "axios";

const API_URL = import.meta.env.VITE_DJANGO_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add JWT token to all requests except public endpoints
api.interceptors.request.use((config) => {
  const publicEndpoints = ['/auth/register/', '/auth/token/', '/auth/password-reset/', '/auth/password-reset-confirm/'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.includes(endpoint));
  
  if (!isPublicEndpoint) {
    const accessToken = localStorage.getItem("appAuthentication.access_token");
    if (accessToken) {
      const token = JSON.parse(accessToken);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post("/auth/token/", { username, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post("/auth/register/", {
    username,
    email,
    password,
  });
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
  // Token removal handled by AuthContext
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
