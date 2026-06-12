import axios from "axios";

const getToken = () => localStorage.getItem('token');

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://kakutausa-1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('token');
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;