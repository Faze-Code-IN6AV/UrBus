const map = L.map('map-template').setView([14.6258, -90.5360], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.locate({ enableHighAccuracy: true });
map.on('locationfound', e => {
  const coords = [e.latlng.lat, e.latlng.lng];

  L.marker(coords, { icon: busIcon })
    .addTo(map)
    .bindPopup('Ubicación actual del bus');
});

L.marker([14.6258, -90.5360])
  .addTo(map)
  .bindPopup('Bienvenido a Kinal!');

  const busIcon = L.divIcon({
  html: "🚌",
  className: "bus-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});