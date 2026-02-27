const socket = io();
const map = L.map('map-template').setView([14.6258, -90.5360], 15);

const kinalCoords = { lat: 14.6258, lng: -90.5360 };
const tolerance = 0.0002;

let busMarker;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcador fijo de Kinal
L.marker([14.6245, -90.5366])
  .addTo(map)
  .bindPopup('Bienvenido a Kinal!');

// Icono del bus
const busIcon = L.divIcon({
  html: "🚌",
  className: "bus-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// ÚNICO listener updateBus
socket.on("updateBus", (coords) => {

  console.log("Recibiendo ubicación:", coords);

  if (!busMarker) {
    busMarker = L.marker([coords.lat, coords.lng], { icon: busIcon })
      .addTo(map)
      .bindPopup("Bus en ruta");
  } else {
    busMarker.setLatLng([coords.lat, coords.lng]);
  }

  const distanceLat = Math.abs(coords.lat - kinalCoords.lat);
  const distanceLng = Math.abs(coords.lng - kinalCoords.lng);

  if (distanceLat <= tolerance && distanceLng <= tolerance) {
    console.log("¡El bus ha llegado a Kinal!");
    busMarker.bindPopup("¡Llegó a Kinal!").openPopup();
  }

});

// Enviar ubicación en tiempo real
navigator.geolocation.watchPosition((position) => {

  const coords = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  console.log("Enviando ubicación:", coords);
  socket.emit("busLocation", coords);

});