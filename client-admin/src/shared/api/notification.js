import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosNotification = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_URL || 'http://localhost:5000/urbus/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

axiosNotification.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getWhatsAppStatus = () =>
  axiosNotification.get('/notifications/whatsapp/status');

export const getWhatsAppQR = () =>
  axiosNotification.get('/notifications/whatsapp/qr');

export const sendArrivalNotification = (number, busName) =>
  axiosNotification.post('/notifications/arrival', { number, busName });

export const sendDelayNotification = (number, busName, minutes) =>
  axiosNotification.post('/notifications/delay', { number, busName, minutes });

export const sendRouteChangeNotification = (number, busName) =>
  axiosNotification.post('/notifications/route-change', { number, busName });

export const sendCustomNotification = (number, message) =>
  axiosNotification.post('/notifications/custom', { number, message });

export const getWhatsAppGroups = () =>
  axiosNotification.get('/notifications/groups')