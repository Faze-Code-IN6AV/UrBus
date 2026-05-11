import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../auth/store/authStore.js';
import { styles } from '../../../styles/location.js';

// Coordenadas del centro (Kinal, Guatemala City)
const CENTER_COORDS = { lat: 14.6245, lng: -90.5366 };

export const LocationPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      // CSS de Leaflet
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // JS de Leaflet — esperar siempre a que window.L esté disponible
      await new Promise((resolve) => {
        if (window.L) {
          resolve();
          return;
        }
        if (!document.getElementById('leaflet-js')) {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          // Script ya en el DOM pero L aún no disponible, polling
          const interval = setInterval(() => {
            if (window.L) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
        }
      });

      initMap();
    };

    const initMap = () => {
      const L = window.L;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView(
        [CENTER_COORDS.lat, CENTER_COORDS.lng],
        15
      );
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Bus estático en Kinal
      const busIcon = L.divIcon({
        html: `<div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🚌</div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([CENTER_COORDS.lat, CENTER_COORDS.lng], { icon: busIcon })
        .addTo(map)
        .bindPopup('<b>Bus</b><br>Ruta finalizada');
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* Header de la sección */}
      <div style={styles.pageHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrap}>
            {/* Ícono de mapa */}
            <svg width="20" height="20" fill="none" stroke="#005691" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </div>
          <div>
            <h1 style={styles.pageTitle}>Mapa a Tiempo Real</h1>
            <p style={styles.pageSubtitle}>
              {isAdmin
                ? 'Gestiona y monitorea la ruta del bus'
                : 'Sigue la ubicación del bus en tiempo real'}
            </p>
          </div>
        </div>

        {/* Badge de estado */}
        <div style={styles.statusBadge}>
          <span style={styles.statusDot} />
          Finalizado
        </div>
      </div>

      {/* Tarjeta del mapa */}
      <div style={styles.mapCard}>
        {/* Barra superior de la tarjeta */}
        <div style={styles.mapCardHeader}>
          <div style={styles.mapCardHeaderLeft}>
            <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span style={styles.mapCardHeaderText}>Actualización en tiempo real</span>
          </div>

          </div>

        {/* Contenedor del mapa Leaflet */}
        <div ref={mapRef} style={styles.mapContainer} />

        {/* Botones admin a lo ancho */}
        {isAdmin && (
          <div style={styles.adminActions}>
            <button style={{ ...styles.actionBtn, ...styles.startBtn }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Iniciar Ruta
            </button>
            <button style={{ ...styles.actionBtn, ...styles.endBtn }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              Finalizar Ruta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};