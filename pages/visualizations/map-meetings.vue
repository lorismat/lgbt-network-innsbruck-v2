<template>
  <HeaderViz />
  <div class="py-12">
    <div id="map"></div>
  </div>
</template>

<script setup>

const locations = useState('dataLocations')
const meetings = useState('dataMeetings')

const meetingsGrouped = useState('meetingsGrouped')
let map;

onMounted(() => {
  map = L.map('map').setView([51.505, -0.09], 4);
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    minZoom: 3,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  const markers = L.markerClusterGroup();

  for (let i = 0; i<meetingsGrouped.value.length; i++) {
    const location = meetingsGrouped.value[i];
    if (location.lat != undefined && location.lon != undefined) {
      // create a string of locations.notes
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
      //
      
      
      /*
      L.marker([location.lat, location.lon]).addTo(map)
        .bindPopup(textBlock);
        */
    }
  }

  map.addLayer(markers);

  
})

watch(() => locations.value, (newValue, oldValue) => {  
})
</script>

<style scoped>
#map { 
  height: 600px; 
}
</style>