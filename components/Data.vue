<template>
  <div></div>
</template>

<script setup>
import * as aq from 'arquero'; // https://uwdata.github.io/arquero/api/

const atToken = 'patwOhRZOSTKbJUxV.dd847338741d978ed40f01985c33fd7b84842c5236fdcee23c99e458f1f69bcf' // Scope for read-only on Writers Loris Version
const atApp ='apprDGAlLVdAvLq9C' // Writers Loris Version is apprDGAlLVdAvLq9C

const atTableLocations = 'tbl1fMrWi7oRHQYB9'
const atTableMeetings = 'tblf4wFqMIdfbmmGJ'
const atTableDocuments = 'tblK0ubVxhYAaUJkG'
const atTableMaterial = 'tblUA8DBovGmRAToe'
const atTablePeople = 'tblwtC6Fi0KHV1VSd' 

const iterator = 10;
const offsetLocations = ref('')
const offsetMeetings = ref('')
const offsetDocuments = ref('')
const offsetMaterial = ref('')
const offsetPeople = ref('')

// tables
const dataLocations = useState('dataLocations', () => []); const triggerLocations = ref(0);
const dataMeetings = useState('dataMeetings', () => []); const triggerMeetings = ref(0);
const dataDocuments = useState('dataDocuments', () => []); const triggerDocuments = ref(0);
const dataMaterial = useState('dataMaterial', () => []); const triggerMaterial = ref(0);
const dataPeople = useState('dataPeople', () => []); const triggerPeople = ref(0);

// build-up datasets
const forMapMeetings = useState('forMapMeetings', () => [])
const forTimeline = useState('forTimeline', () => [])

// iterator to bypass Airtable limit to 100 entries
function iterCalls(iterator, table, offset, data, trigger) {
  if (offset.value !== undefined) {
    callAtTable(atToken, atApp, table, offset.value).then((res) => {
      data.value = data.value.concat(res.data.records)
      offset.value = res.data.offset
      iterCalls(iterator - 1, table, offset, data, trigger)
    })
  } else {
    trigger.value = Math.random();
    offset.value = undefined;
  }
  return iterator
}

onMounted(() => {
  iterCalls(iterator, atTableLocations, offsetLocations, dataLocations, triggerLocations)
  iterCalls(iterator, atTableMeetings, offsetMeetings, dataMeetings, triggerMeetings)
  iterCalls(iterator, atTableDocuments, offsetDocuments, dataDocuments, triggerDocuments)
  iterCalls(iterator, atTableMaterial, offsetMaterial, dataMaterial, triggerMaterial)
  iterCalls(iterator, atTablePeople, offsetPeople, dataPeople, triggerPeople)
})

// forMapMeetings
watch(() => [triggerLocations.value, triggerMeetings.value], () => {
  if (offsetLocations.value == undefined && offsetMeetings.value == undefined) {
    const locations = dataLocations.value.map(x => x.fields)
    locations.forEach((location, i) => {
      location['createdLoc'] = dataLocations.value[i].id
    })
    const meetings = dataMeetings.value.map(x => x.fields)
    meetings.forEach((meeting, index) => {
      if (meeting['Location'] != undefined) {
        meeting['createdLoc'] = meeting['Location'][0]
      }
    })
    const tLocations = aq.from(locations)
    const tMeetings = aq.from(meetings)

    const tMeetingsComplete = tMeetings.join(tLocations, 'createdLoc')
    forMapMeetings.value = tMeetingsComplete.groupby('createdLoc').rollup({
      city: aq.op.max('Name'),
      notes: aq.op.array_agg('Summary'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();
  }
})

// forTimeline: Meetings, Documents, Material
// each table should be flattened to have one entry per Meeting/Documents/Material per Author
watch(() => [triggerMeetings.value, triggerDocuments.value, triggerMaterial.value, triggerPeople.value], () => {
  if (offsetMeetings.value == undefined && offsetDocuments.value == undefined && offsetMaterial.value == undefined && offsetPeople.value == undefined) {
    
    // create people table
    const people = dataPeople.value.map(x => x.fields)
    people.forEach((person, i) => {
      person['createdPerson'] = dataPeople.value[i].id
    })
    const tPeople = aq.from(people)

    // create meetings table
    const meetings = dataMeetings.value.map(x => x.fields)
    const tMeetings = aq.from(meetings)
    console.log(tMeetings.unroll('Participants'))
  }
})


</script>