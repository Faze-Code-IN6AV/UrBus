// src/shared/api/postClient.js
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import useAuthStore from '../store/authStore';
import { refreshAccessToken } from './authClient';

const postClient = axios.create({
  baseURL: ENDPOINTS.POST,
  timeout: 15000,
});

postClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

postClient.interceptors.response.use(
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
      return postClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default postClient;
