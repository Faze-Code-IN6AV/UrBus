import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosNotification = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Interceptor de REQUEST: adjuntar token ---
axiosNotification.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Interceptor de RESPONSE: renovar token si expira (401) ---
let _isRefreshing = false;
let _failedQueue = [];

function _processQueue(error, token = null) {
  _failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  _failedQueue = [];
}

axiosNotification.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original || original._retry) return Promise.reject(error);

    const status = error.response?.status;
    const isRefreshEndpoint = (original.url || '').includes('/auth/refresh');

    // Solo intentar refresh en 401, no en 403, 500, etc.
    if (status !== 401 || isRefreshEndpoint) return Promise.reject(error);

    const refreshToken = useAuthStore.getState().refreshToken;
    const authBaseURL = import.meta.env.VITE_AUTH_URL;

    // Si no hay refreshToken, no intentar — simplemente rechazar y dejar que
    // el interceptor del auth-service (api.js) maneje su propio ciclo.
    if (!refreshToken || !authBaseURL) {
      return Promise.reject(error);
    }

    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        _failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers['Authorization'] = 'Bearer ' + token;
        return axiosNotification(original);
      });
    }

    original._retry = true;
    _isRefreshing = true;

    try {
      // Usar la misma instancia base de axios (no axiosNotification) para el refresh
      const response = await axios.post(
        `${authBaseURL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, refreshToken: newRefreshToken, expiresAt, userDetails } = response.data;

      useAuthStore.setState({
        token,
        refreshToken: newRefreshToken,
        expiresAt,
        user: userDetails || useAuthStore.getState().user,
        isAuthenticated: true,
      });

      _processQueue(null, token);
      original.headers['Authorization'] = 'Bearer ' + token;
      return axiosNotification(original);
    } catch (err) {
      _processQueue(err, null);
      // Solo hacer logout si el refresh falla con 401/403 — no con 500
      // (un 500 es error del servidor, no credenciales inválidas)
      const refreshStatus = err?.response?.status;
      if (refreshStatus === 401 || refreshStatus === 403) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(err);
    } finally {
      _isRefreshing = false;
    }
  }
);

// --- Endpoints ---
export const getWhatsAppStatus = () =>
  axiosNotification.get('/notifications/whatsapp/status');

export const getWhatsAppQR = () =>
  axiosNotification.get('/notifications/whatsapp/qr');

export const sendArrivalNotification = (number, busName) =>
  axiosNotification.post('/notifications/arrival', { number, busName });

export const sendDelayNotification = (number, busName, minutes) =>
  axiosNotification.post('/notifications/delay', { number, busName, minutes: Number(minutes) });

export const sendRouteChangeNotification = (number, busName) =>
  axiosNotification.post('/notifications/route-change', { number, busName });

export const sendCustomNotification = (number, message) =>
  axiosNotification.post('/notifications/custom', { number, message });

export const getWhatsAppGroups = () =>
  axiosNotification.get('/notifications/groups');