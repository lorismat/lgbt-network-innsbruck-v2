<template>
  <HeaderViz />
  <BaseContent 
    title="Map of Author Meetings"
    part1="
    This interactive map plots meetings between LGBTQ+ exile writers across the globe. The numbers in the icons indicate the number of locations where these meetings took place in different parts of the world. If you select an icon, they will divide ever more precisely according to location. If you click on an individual location icon, a pop-up box will give you further information about the meetings between writers that took place in the given location.
    "
  />

  <BaseLoader :displayLoader="displayLoader" padding="py-6" />

  <div class="py-12">
    <div id="map"></div>
  </div>
</template>

<script setup>

/* LOADER */
const allAuthors = useState('allAuthors')
const displayLoader = ref('block')
watch(() => allAuthors.value, (newValue, oldValue) => {
  displayLoader.value = 'none';
  generateMarker(mapMeetingsDataset.value, L, map)
})
onMounted(() => {
  if (allAuthors.value.length > 0) {
    displayLoader.value = 'none';
  }
})

const appConfig = useAppConfig()

const counterMapMeeting = useState('counterMapMeeting')
const mapMeetingsDataset = useState('mapMeetingsDataset')
const peopleDataset = useState('peopleDataset')

let map;
const markers = ref();
const specIcon = ref();

watch(() => counterMapMeeting.value, (newValue, oldValue) => {
  if (counterMapMeeting.value > 0) {
    generateMarker(mapMeetingsDataset.value, L, map)
  }
})

function generateMarker(dataset, L, map) {

  if (markers.value != undefined) {
    map.removeLayer(markers.value);

    // reinitialize markers
    markers.value = L.markerClusterGroup({
      spiderLegPolylineOptions: { weight: 0 },
      icon: specIcon.value,
      polygonOptions: {
        fillColor: 'transparent',
        color: '#fff',
        opacity: 0
      },
      iconCreateFunction: function(cluster) {
        const radius = Math.max(30, Math.min(7 * cluster.getChildCount(), 100));
        return L.divIcon({ 
          html: cluster.getChildCount(),
          className: 'mycluster',
          iconSize: L.point(radius, radius)
        });
      }
    });
  }

  for (let i = 0; i<dataset.length; i++) {
    const location = mapMeetingsDataset.value[i];
    if (location.lat != undefined && location.lon != undefined) {
      let notes = ''
      let participantString = []
      for (let j = 0; j<location.participants.length; j++) { 
        let participantStringEl = "<span class='font-bold'>Participants:</span><br>"
        for (let k = 0; k<location.participants[j].length; k++) {
          const participantInfo = peopleDataset.value.filter(x => x['ID_1'] === location.participants[j][k])[0]
          if (participantInfo != undefined) {
            participantStringEl += '• ' + participantInfo.ID_1 + 
            ` (${participantInfo['Date of birth']} — ${participantInfo['Date of death']})` + 
            ` was a ${participantInfo['Nationality'] != undefined ? participantInfo['Nationality'].join('/') : ''}, ` + 
            `<span class=''>${participantInfo['Sexual orientation']}</span>, ` +
            `${participantInfo['Occupation'] != undefined ? participantInfo['Occupation'].join(', ') : ''}` +
            '<br>'
          }
        }
        participantString.push(participantStringEl)
      }

      for (let j = 0; j<location.notes.length; j++) {

        let page = location.page[j];
        if (page.includes('-')) {
          page = 'pp. ' + page
        } else {
          page = 'p. ' + page
        }

        notes += `
          <div class='border-b border-dotted border-gray-600 pb-1 pt-4 px-2'>
            <span class='font-bold'>${location.dateStart[j]} — ${location.dateEnd[j]}:</span> ${location.notes[j]}
            <br><br>
            ${participantString[j]}
            <br><br>
            <span class='font-bold'>Source:</span> <span class='italic'>${location.source[j].split('_')[0].split('by')[0]}</span> by <span>${location.source[j].split('_')[0].split('by')[1]}</span>
            (${page})
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
      markers.value.addLayer(L.marker(
        [location.lat, location.lon]
      ).bindPopup(textBlock));
    }
  }
  map.addLayer(markers.value);
}

onMounted(() => {
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

  const specIcon = L.icon({
    iconUrl: '/images/marker.png',
    iconSize:     [20, 30], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [-10, -20] // point from which the popup should open relative to the iconAnchor
  });

  L.Marker.mergeOptions({
      icon: specIcon
  });

  markers.value = L.markerClusterGroup({
    spiderLegPolylineOptions: { weight: 0 },
    icon: specIcon,
    polygonOptions: {
      fillColor: 'transparent',
      color: '#fff',
      opacity: 0
    },
    iconCreateFunction: function(cluster) {

      const radius = Math.max(30, Math.min(7 * cluster.getChildCount(), 100));

      return L.divIcon({ 
        html: cluster.getChildCount(),
        className: 'mycluster',
        iconSize: L.point(radius, radius)
      });
    }
  });
})
</script>