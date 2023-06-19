<template>
  <HeaderViz />
  <BaseContent 
    title="Map of Author Meetings"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />
  <div class="pb-12 pt-6">
    <div id="map"></div>
  </div>
</template>

<script setup>
const appConfig = useAppConfig()

const mapMeetingsDataset = useState('mapMeetingsDataset')
const peopleDataset = useState('peopleDataset')
let map;


onMounted(() => {
  // try: Jawg.Light
  // try: Stadia.AlidadeSmooth
  // try: Stamen_TonerBackground
  // try: Stamen_TonerLite
  // try: Esri.WorldGrayCanvas
  // try: CartoDB.PositronNoLabels
  // try: with extra Stamen.TonerLabels
  map = L.map('map').setView(appConfig.map.center, appConfig.map.zoomInit);

  /* CartoDB.PositronNoLabels */
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 10,
    minZoom: 2,
    ext: 'png'
  }).addTo(map);

  /* Stamen Toner Labels */
  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 10,
    minZoom: 8,
    ext: 'png'
  }).addTo(map);

  /* Esri.WorldGrayCanvas
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 10,
    minZoom: 2,
  }).addTo(map);
  */

  /* Stadia.AlidadeSmooth
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    minZoom: 2,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);
  */ 

  const specIcon = L.icon({
    iconUrl: '/images/marker.png',
    iconSize:     [20, 30], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [-10, -20] // point from which the popup should open relative to the iconAnchor
  });

  L.Marker.mergeOptions({
      icon: specIcon
  });

  const markers = L.markerClusterGroup({
    spiderLegPolylineOptions: { weight: 0 },
    icon: specIcon,
    polygonOptions: {
      fillColor: 'transparent',
      color: '#fff',
      opacity: 0
    },
    iconCreateFunction: function(cluster) {
      return L.divIcon({ 
        html: cluster.getChildCount(),
        className: 'mycluster',
        iconSize: L.point(35, 35)
      });
    }
  });

  for (let i = 0; i<mapMeetingsDataset.value.length; i++) {
    const location = mapMeetingsDataset.value[i];
    if (location.lat != undefined && location.lon != undefined) {
      let notes = ''
      let participantString = "<span class='font-bold'>Participants:</span><br>"
      for (let j = 0; j<location.participants.length; j++) {
        const participantInfo = peopleDataset.value.filter(x => x['ID'] == location.participants[j])[0]
        participantString += '• ' + participantInfo.ID + 
          ` (${participantInfo['Date of birth']} — ${participantInfo['Date of death']})` + 
          `<br>${participantInfo['Nationality'] != undefined ? participantInfo['Nationality'][0] : ''}; ` + 
          `${participantInfo['Occupation'] != undefined ? participantInfo['Occupation'].join(', ') : ''}` +
          `. <span class=''>${participantInfo['Sexual orientation']}</span><br>`
          '<br><br>'
      }
      for (let j = 0; j<location.notes.length; j++) {
        notes += `
          <div class='border-b border-dotted border-gray-600 pb-1 pt-4 px-2'>
            <span class='font-bold'>${location.dateStart[j]}:</span> ${location.notes[j]}
            <br><br>
            ${participantString}
            <br><br>
            <span class='font-bold'>Source:</span> ${location.source.split('_')[0]}
          </div>
        `
      }
      const textBlock = `
        <h2 class='text-md font-bold p-2 border-b border-gray-400'>Meetings in ${location.city} <span class='font-normal'>(${location.count})</span></h2>
        <div class='px-0 py-0'>
          <p>${notes}</p>
        </div>
        <!-- <p>${location.count} meetings</p> -->
      `
      markers.addLayer(L.marker(
        [location.lat, location.lon]
      ).bindPopup(textBlock));
    }
  }
  map.addLayer(markers);
})
</script>

<style>
#map { 
  height: 600px; 
}



.mycluster {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: bold;
  border: 1px solid #222;
}

.leaflet-popup-content {
  margin: 0 !important;
  width: 350px !important;
}
.leaflet-popup-content-wrapper {
  padding: 0px;
  max-height: 400px;
  
  overflow: auto !important;
}

</style>