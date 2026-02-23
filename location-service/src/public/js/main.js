var map = L.map('map-template').setView([14.61350, -90.54975], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([50.5, 30.5])
  .addTo(map)
  .bindPopup('Hello There!');