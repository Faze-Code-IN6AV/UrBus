// src/shared/api/authClient.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/endpoints';
import useAuthStore from '../store/authStore';

const NO_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
];

const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 15000,
});

authClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function resolveQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

export function shouldSkipRefresh(url = '') {
  return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

/**
 * Ejecuta (o encola) el refresh del access token.
 * Compartido por authClient, passengerClient y postClient para que
 * las 3 instancias reutilicen una única renovación en curso.
 */
export function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  return (async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const { data } = await axios.post(`${ENDPOINTS.AUTH}/auth/refresh`, {
        refreshToken: storedRefreshToken,
      });

      const { token, refreshToken, expiresAt } = data;

      useAuthStore.setState({ token, refreshToken, expiresAt });
      await SecureStore.setItemAsync('refreshToken', refreshToken);

      resolveQueue(null, token);
      return token;
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      useAuthStore.getState().logout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  })();
}

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      shouldSkipRefresh(originalRequest?.url) ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return authClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default authClient;
