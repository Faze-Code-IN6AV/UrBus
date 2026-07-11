// src/shared/api/passengerApi.js
// Endpoints de gestión de pasajeros, portados de client-admin (shared/api/passenger.js).
// El backend de passenger-service solo expone create / list / me / status / delete;
// no existe una ruta para editar el nombre de un pasajero ya vinculado.
import passengerClient from './passengerClient';

export const getPassengers = () => passengerClient.get('/passengers');

export const getMyPassengerStatus = () => passengerClient.get('/passengers/me');

// POST /passengers — requiere ADMIN_ROLE o DRIVER_ROLE
export const createPassenger = (data) => passengerClient.post('/passengers', data);

// PATCH /passengers/:id/status — ADMIN, DRIVER o el propio PASSENGER (solo su registro)
export const updatePassengerStatus = (id, status) =>
    passengerClient.patch(`/passengers/${id}/status`, { status });

// DELETE /passengers/:id — requiere ADMIN_ROLE
export const deletePassenger = (id) => passengerClient.delete(`/passengers/${id}`);