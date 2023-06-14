<template>
  <HeaderViz />
  <div class="py-12">
    <div id="map"></div>
  </div>
</template>

<script setup>
const forMapMeetings = useState('forMapMeetings')
let map;

onMounted(() => {
  map = L.map('map').setView([51.505, -0.09], 4);
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    minZoom: 3,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  const markers = L.markerClusterGroup();

  for (let i = 0; i<forMapMeetings.value.length; i++) {
    const location = forMapMeetings.value[i];
    if (location.lat != undefined && location.lon != undefined) {
      let notes = ''
      for (let j = 0; j<location.notes.length; j++) {
        notes += location.notes[j] + '<br><br>'
      }
      const textBlock = `
        <h2>Meetings in ${location.city}</h2>
        <p>${notes}</p>
        <p>${location.count} meetings</p>
      `
      markers.addLayer(L.marker(
        [location.lat, location.lon]
      ).bindPopup(textBlock));
    }
  }
  map.addLayer(markers);
})
</script>

<style scoped>
#map { 
  height: 600px; 
}
</style>