const socket = io();
const map = L.map('map-template').setView([14.6258, -90.5366], 15);

// Coordenadas de Kinal
const kinalCoords = { lat: 14.6245, lng: -90.5366 };
const arrivalToleranceMeters = 50; // tolerancia de llegada en metros

// Marcador del bus
let busMarker;
let hasArrived = false; // Flag para controlar llegada

// Tile layer de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcador fijo de Kinal
L.marker([kinalCoords.lat, kinalCoords.lng])
  .addTo(map)
  .bindPopup('Bienvenido a Kinal!');

// Icono del bus
const busIcon = L.divIcon({
  html: "🚌",
  className: "bus-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Función para calcular distancia en metros usando Haversine
function distanceInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // radio de la Tierra en metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Listener updateBus – actualización de ubicación en tiempo real
socket.on("updateBus", (coords) => {
  console.log("Recibiendo ubicación:", coords);

  if (!busMarker) {
    busMarker = L.marker([coords.lat, coords.lng], { icon: busIcon })
      .addTo(map)
      .bindPopup("Bus en ruta");
  } else {
    busMarker.setLatLng([coords.lat, coords.lng]);
  }

  // Verificar llegada a Kinal solo una vez
  const distance = distanceInMeters(coords.lat, coords.lng, kinalCoords.lat, kinalCoords.lng);
  if (!hasArrived && distance <= arrivalToleranceMeters) {
    console.log("🚍 ¡El bus ha llegado a Kinal!");
    busMarker.setPopupContent("¡Llegó a Kinal!").openPopup();
    hasArrived = true;
  }
});


//Iniciar viaje y enviar ubicación real del bus al servidor
let hasSentInitial = false;
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      console.log("Enviando ubicación real:", coords);
      socket.emit("busLocation", coords);

      if (!hasSentInitial) {
        hasSentInitial = true;
        alert("¡Viaje iniciado! Ubicación enviada al mapa.");
      }
    },
    (err) => {
      console.error("Error obteniendo ubicación:", err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000
    }
  );
} else {
  alert("Geolocalización no soportada en este dispositivo.");
}