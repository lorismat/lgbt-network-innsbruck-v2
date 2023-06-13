<template>
  <HeaderViz />
  <div class="py-12">
    <div v-if="locations[117] !== undefined" >
      hey - {{ locations.length }} - {{ locations[117].fields.Name }}
    </div>
    <div id="map"></div>
  </div>
</template>

<script setup>

const locations = useState('locations');
const map = ref(null);

onMounted(() => {
  map.value = L.map('map').setView([51.505, -0.09], 4);
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    minZoom: 3,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map.value);
})

watch(() => locations.value, (newValue, oldValue) => {
  console.log(locations.value);
  for (let i = 0; i<locations.value.length; i++) {
    const location = locations.value[i];
    const lat = location.fields.Latitude;
    const lon = location.fields.Longitude;
    const name = location.fields.Name;
    if (location.fields.Latitude !== undefined && location.fields.Longitude !== undefined) {
      L.marker([lat, lon]).addTo(map.value)
        .bindPopup(name)
    }
    //const marker = L.marker([lat, lon]).addTo(map.value)
      //.bindPopup(name)
      //.openPopup();
  }
  //L.marker([51.5, Math.random()*100]).addTo(map.value)
    //.bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //.openPopup();
})
</script>

<style scoped>
#map { 
  height: 600px; 
}
</style>