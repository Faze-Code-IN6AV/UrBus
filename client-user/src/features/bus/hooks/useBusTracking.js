// src/features/bus/hooks/useBusTracking.js
import { useState, useEffect, useCallback } from 'react';
import {
  connectLocationSocket,
  onUpdateBus,
  onBusArrived,
  disconnectLocationSocket,
} from '../../../shared/sockets/locationSocket';

/**
 * Hook de rastreo del bus en tiempo real.
 * No consume API REST: toda la información llega por Socket.IO
 * (el pasajero solo escucha "updateBus" y "busArrived").
 */
export function useBusTracking() {
  const [coords, setCoords] = useState(null); // { lat, lng, updatedAt }
  const [arrived, setArrived] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    try {
      connectLocationSocket();

      onUpdateBus((data) => {
        if (!mounted) return;
        setCoords({
          lat: data.lat,
          lng: data.lng,
          updatedAt: Date.now(),
        });
        setConnecting(false);
      });

      onBusArrived(() => {
        if (!mounted) return;
        setArrived(true);
      });

      setConnecting(false);
    } catch (err) {
      if (mounted) {
        setError(err?.message ?? 'No se pudo conectar al servicio de ubicación');
        setConnecting(false);
      }
    }

    // Cleanup: desconectar el socket al desmontar (evita fugas de conexión al cambiar de tab)
    return () => {
      mounted = false;
      disconnectLocationSocket();
    };
  }, []);

  const resetArrived = useCallback(() => {
    setArrived(false);
  }, []);

  return { coords, arrived, connecting, error, resetArrived };
}
