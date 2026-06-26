import axios from "axios";
import { getStoredToken, clearStoredAuth } from "../utils/storage.js";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
    }
    return Promise.reject(error);
  }
);

export const getApiError = (error, fallback = "Something went wrong") =>
  error.response?.data?.message || error.message || fallback;
