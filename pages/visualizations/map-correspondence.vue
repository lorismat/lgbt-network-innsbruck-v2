<template>
  <HeaderViz />
  <div class="py-12">
    <div></div>
    <div id="map"></div>
  </div>
</template>

<script setup>


onMounted(() => {
  const map = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();
})
</script>

<style scoped>
#map { 
  height: 600px; 
}
</style>