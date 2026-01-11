import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Ensure this matches your backend URL
});

// --- THE MISSING PIECE: Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from local storage
    const token = localStorage.getItem("token");
    
    // 2. If token exists, attach it to the header
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