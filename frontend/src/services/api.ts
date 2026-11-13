import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Otomatis menyertakan token pada request yang membutuhkan autentikasi.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("sia_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
