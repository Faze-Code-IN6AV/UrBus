// src/shared/sockets/locationSocket.js
import { io } from 'socket.io-client';
import { ENDPOINTS } from '../constants/endpoints';

let socket = null;

/**
 * Conecta al namespace raíz de location-service.
 * El pasajero SOLO escucha "updateBus" y "busArrived";
 * nunca emite "busLocation" (eso es exclusivo del conductor).
 */
export function connectLocationSocket() {
  if (socket?.connected) return socket;

  socket = io(ENDPOINTS.LOCATION, {
    transports: ['websocket'],
    reconnection: true,
  });

  return socket;
}

export function onUpdateBus(callback) {
  socket?.on('updateBus', callback);
}

export function onBusArrived(callback) {
  socket?.on('busArrived', callback);
}

export function disconnectLocationSocket() {
  if (socket) {
    socket.off('updateBus');
    socket.off('busArrived');
    socket.disconnect();
    socket = null;
  }
}
