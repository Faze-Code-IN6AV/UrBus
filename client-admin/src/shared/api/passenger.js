import axios from '../utils/axios.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosPassenger = axios.create({
    baseURL: import.meta.env.VITE_PASSENGER_URL,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
});

axiosPassenger.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getPassengers = () =>
    axiosPassenger.get('/passengers');

// POST /api/v1/passengers  — requiere ADMIN_ROLE
export const createPassenger = (data) =>
    axiosPassenger.post('passengers', data);

// PATCH /api/v1/passengers/:id/status  — ADMIN, DRIVER o propio PASSENGER
export const updatePassengerStatus = (id, data) =>
    axiosPassenger.patch(`/passengers/${id}/status`, { data });

// DELETE /api/v1/passengers/:id  — requiere ADMIN_ROLE
export const deletePassenger = (id) =>
    axiosPassenger.delete(`/passengers/${id}`)
