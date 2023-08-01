<template>
  <HeaderViz />
  <BaseContent 
    title="Map of Correspondence Between Authors"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />
  <div class="pb-12 pt-6">
    <FormKit
      v-model="letterType"
      type="radio"
      label=" "
      :options="{
        from: 'Letters sent from',
        to: 'Letters sent to'
      }"
      help=" "

      outer-class="!mb-0"
      fieldset-class="border-0"
      options-class="flex gap-8"
      wrapper-class="!items-end border-0"
      decorator-class="text-gray-500 peer-checked:ring-gray-500 peer-checked:text-gray-500"
    />
    <div id="map"></div>
  </div>
</template>

<script setup>
const appConfig = useAppConfig()

const mapCorrespondenceDatasetIn = useState('mapCorrespondenceDatasetIn')
const mapCorrespondenceDatasetOut = useState('mapCorrespondenceDatasetOut')
const peopleDataset = useState('peopleDataset')

const letterType = ref('from')

let map;
const markers = ref();
const specIcon = ref();

function generateMarker(dataset, L, map, target) {

  

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

    //markers.value = ;
  }

  for (let i = 0; i<dataset.length; i++) {
    const location = dataset[i];

    console.log('location map corress', location);

    if (location.lat != undefined && location.lon != undefined) {
      let notes = ''
      /*
      const agentInfo = peopleDataset.value.filter(x => x['ID'] == location.agent)[0]
      let agentString = `<span class='font-bold'>Agent:</span>${agentInfo.ID}<br>`
      */
      /*
      const participantInfo = peopleDataset.value.filter(x => x['ID'] == location.participants[j])[0]
      participantString += '• ' + participantInfo.ID + 
        ` (${participantInfo['Date of birth']} — ${participantInfo['Date of death']})` + 
        `<br>${participantInfo['Nationality'] != undefined ? participantInfo['Nationality'][0] : ''}; ` + 
        `${participantInfo['Occupation'] != undefined ? participantInfo['Occupation'].join(', ') : ''}` +
        `. <span class=''>${participantInfo['Sexual orientation']}</span><br>`
        '<br><br>'
      */

      for (let j = 0; j<location.notes.length; j++) {

        let agentName = location.agent[j]
        let agentInfo = {
          "dob": location.agent_dob[j],
          "dod": location.agent_dod[j],
          "occupation": location.agent_occupation[j],
          "orientation": location. agent_sexual_orientation[j],
          "nationality": location. agent_nationality[j].join('/')
        }
        let recipientName = location.recipient[j]
        let recipientInfo = {
          "dob": location.recipient_dob[j],
          "dod": location.recipient_dod[j],
          "occupation": location.recipient_occupation[j],
          "orientation": location.recipient_sexual_orientation[j],
          "nationality": location.recipient_nationality[j].join('/')
        }

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
            <span class='font-bold'>Agent:</span> ${agentName} (${agentInfo.dob} — ${agentInfo.dod}) 
            was a ${agentInfo.nationality}, ${agentInfo.orientation}, ${agentInfo.occupation.join(', ')}
            <br>
            <span class='font-bold'>Recipient:</span> ${recipientName} (${recipientInfo.dob} — ${recipientInfo.dod}) 
            was a ${recipientInfo.nationality}, ${recipientInfo.orientation}, ${recipientInfo.occupation.join(', ')}
            <br>
            <br><br>
            <span class='font-bold'>Source:</span> <span class='italic'>${location.source[j].split('_')[0].split('by')[0]}</span> by <span>${location.source[j].split('_')[0].split('by')[1]}</span>
            (${page})
          </div>
        `
      }
      const textBlock = `
        <h2 class='text-md font-bold p-2 border-b border-gray-400'>Letters sent ${target} ${location.city} <span class='font-normal'>(${location.count})</span></h2>
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

  specIcon.value = L.icon({
    iconUrl: '/images/marker.png',
    iconSize:     [20, 30], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [-10, -20] // point from which the popup should open relative to the iconAnchor
  });

  L.Marker.mergeOptions({
      icon: specIcon.value
  });

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
        style: "{ 'background-color': 'red'}",
        iconSize: L.point(radius, radius)
      });
    }
  });
  generateMarker(mapCorrespondenceDatasetIn.value, L, map, 'from')
})

watch(() => letterType.value, (newValue, oldValue) => {

  if (newValue == 'to') {
    generateMarker(mapCorrespondenceDatasetOut.value, L, map, 'to')
  } else {
    generateMarker(mapCorrespondenceDatasetIn.value, L, map, 'from')
  } 
})
</script>