// src/shared/sockets/locationSocket.js
import { io } from 'socket.io-client';
import { ENDPOINTS } from '../constants/endpoints';

let socket = null;

/**
 * Conecta al namespace raíz de location-service.
 * El pasajero SOLO escucha "updateBus" y "busArrived".
 * El conductor (DRIVER_ROLE/ADMIN_ROLE), además, puede emitir "busLocation"
 * para transmitir su GPS en tiempo real — función portada de la página
 * "Mapa en Vivo" de client-admin (Iniciar Ruta / Finalizar Ruta).
 */
export function connectLocationSocket() {
  if (socket?.connected) return socket;
  socket = io(ENDPOINTS.LOCATION, { transports: ['websocket'], reconnection: true });
  return socket;
}

export function onUpdateBus(callback) {
  socket?.on('updateBus', callback);
}
export function onBusArrived(callback) {
  socket?.on('busArrived', callback);
}
export function onConnectionChange(onConnect, onDisconnect) {
  socket?.on('connect', onConnect);
  socket?.on('disconnect', onDisconnect);
}
/** Emite la posición GPS del bus. Uso exclusivo del conductor. */
export function emitBusLocation(coords) {
  socket?.emit('busLocation', coords);
}
export function disconnectLocationSocket() {
  if (socket) {
    socket.off('updateBus');
    socket.off('busArrived');
    socket.off('connect');
    socket.off('disconnect');
    socket.disconnect();
    socket = null;
  }
}