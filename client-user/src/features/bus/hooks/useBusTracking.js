// src/features/bus/hooks/useBusTracking.js
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import {
  connectLocationSocket, onUpdateBus, onBusArrived, onConnectionChange,
  emitBusLocation, disconnectLocationSocket,
} from '../../../shared/sockets/locationSocket';

/**
 * Hook de rastreo del bus en tiempo real.
 * Todos los roles escuchan "updateBus" / "busArrived" por Socket.IO.
 * Además, para DRIVER_ROLE/ADMIN_ROLE expone startRoute/endRoute, que transmiten
 * el GPS del dispositivo como "busLocation" — función portada de client-admin
 * (features/location/pages/LocationPage.jsx: Iniciar Ruta / Finalizar Ruta).
 */
export function useBusTracking() {
  const [coords, setCoords] = useState(null);
  const [arrived, setArrived] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(null);
  const [routeActive, setRouteActive] = useState(false);
  const watchRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    try {
      connectLocationSocket();
      onConnectionChange(
        () => mounted && setConnected(true),
        () => mounted && setConnected(false)
      );
      onUpdateBus((data) => {
        if (!mounted) return;
        setCoords({ lat: data.lat, lng: data.lng, updatedAt: Date.now() });
        setConnecting(false);
      });
      onBusArrived(() => { if (mounted) setArrived(true); });
      setConnecting(false);
    } catch (err) {
      if (mounted) {
        setError(err?.message ?? 'No se pudo conectar al servicio de ubicación');
        setConnecting(false);
      }
    }

    return () => {
      mounted = false;
      watchRef.current?.remove?.();
      disconnectLocationSocket();
    };
  }, []);

  const resetArrived = useCallback(() => setArrived(false), []);

  const startRoute = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Se necesita permiso de ubicación para iniciar la ruta');
      return;
    }
    setArrived(false);
    setRouteActive(true);
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
      (position) => {
        emitBusLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      }
    );
  }, []);

  const endRoute = useCallback(() => {
    watchRef.current?.remove?.();
    watchRef.current = null;
    setRouteActive(false);
    setCoords(null);
    setArrived(false);
  }, []);

  return { coords, arrived, connected, connecting, error, routeActive, resetArrived, startRoute, endRoute };
}