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

export interface CreateBookingPayload {
  serviceId: string;
  scheduledDate: string;
  problemDescription: string;
  address: string;
  totalPrice: number;
}

export const bookingsApi = {
  create: async (data: CreateBookingPayload) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },
  getClientBookings: async () => {
    const response = await api.get("/bookings/client");
    return response.data;
  },
  getVendorBookings: async () => {
    const response = await api.get("/bookings/vendor");
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  }
};

export const servicesApi = {
  getById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  }
};