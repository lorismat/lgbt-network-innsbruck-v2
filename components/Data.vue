<template>
  <div></div>
</template>

<script setup>
import * as aq from 'arquero';

const atToken = 'patwOhRZOSTKbJUxV.dd847338741d978ed40f01985c33fd7b84842c5236fdcee23c99e458f1f69bcf' // Scope for read-only on Writers Loris Version
const atApp ='apprDGAlLVdAvLq9C' // Writers Loris Version is apprDGAlLVdAvLq9C

const atTableLocations = 'tbl1fMrWi7oRHQYB9' // Locations
const atTableMeetings = 'tblf4wFqMIdfbmmGJ' // Meetings

const trigger = ref(0)
const offsetLocations = ref('')
const offsetMeetings = ref('')

const dataLocations = useState('dataLocations', () => [])
const dataMeetings = useState('dataMeetings', () => [])

const meetingsGrouped = useState('meetingsGrouped', () => [])

function iterCalls(counter, table, offset, data) {
  if (offset.value !== undefined) {
    callAtTable(atToken, atApp, table, offset.value).then((res) => {
      data.value = data.value.concat(res.data.records)
      offset.value = res.data.offset
      iterCalls(counter - 1, table, offset, data)
    })
  } else {
    trigger.value = Math.random();
    offset.value = undefined;
  }
  return counter
}

onMounted(() => {
  iterCalls(10, atTableLocations, offsetLocations, dataLocations)
  iterCalls(10, atTableMeetings, offsetMeetings, dataMeetings)
})

watch(() => trigger.value, () => {
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
    console.log(tMeetingsComplete);
    meetingsGrouped.value = tMeetingsComplete.groupby('createdLoc').rollup({
      city: aq.op.max('Name'),
      notes: aq.op.array_agg('Summary'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();

    

  }
})

</script>