import axios from "axios";

// 1. DYNAMIC BASE URL
// If we are on Vercel, it uses the Environment Variable.
// If we are running locally, it falls back to localhost:3000.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// 2. REQUEST INTERCEPTOR (Attaches Token automatically)
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem("token");
    
    // If token exists, attach it to the header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;