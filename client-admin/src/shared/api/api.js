import axios from '../utils/axios.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
});

const axiosAdmin = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
});

export { axiosAuth, axiosAdmin };