<template>
  <HeaderViz />
  <BaseContent 
    title="Map of Author Meetings"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />
  <div class="py-12">
    <div id="map"></div>
  </div>
</template>

<script setup>
const mapMeetingsDataset = useState('mapMeetingsDataset')
let map;

onMounted(() => {
  map = L.map('map').setView([51.505, -0.09], 2);
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    minZoom: 2,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  const markers = L.markerClusterGroup({
    spiderLegPolylineOptions: { weight: 0 },
    polygonOptions: {
      fillColor: 'transparent',
      color: '#3887be',
      weight: 1.5,
      opacity: 0,
      fillOpacity: 0.2
    },
    iconCreateFunction: function(cluster) {
      return L.divIcon({ html: `<b class='p-5 -mx-1 rounded-full border-2 border-black text-xs bg-gray-50'>` + cluster.getChildCount() + '</b>' });
    }
  });

  for (let i = 0; i<mapMeetingsDataset.value.length; i++) {
    const location = mapMeetingsDataset.value[i];
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