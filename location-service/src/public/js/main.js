const map = L.map('map-template').setView([14.6258, -90.5360], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([14.6258, -90.5360])
  .addTo(map)
  .bindPopup('Bienvenido a Kinal!');