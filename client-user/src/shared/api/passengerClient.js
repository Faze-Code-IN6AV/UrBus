// src/shared/api/passengerClient.js
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import useAuthStore from '../store/authStore';
import { refreshAccessToken } from './authClient';

const passengerClient = axios.create({
  baseURL: ENDPOINTS.PASSENGER,
  timeout: 15000,
});

passengerClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

passengerClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return passengerClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default passengerClient;
