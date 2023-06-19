<template>
  <div></div>
</template>

<script setup>
import * as aq from 'arquero'; // https://uwdata.github.io/arquero/api/

const appConfig = useAppConfig()

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
const mapMeetingsDataset = useState('mapMeetingsDataset', () => [])
const mapCorrespondenceDataset = useState('mapCorrespondenceDataset', () => [])
const peopleDataset = useState('peopleDataset', () => [])

const meetingsDataset = useState('meetingsDataset', () => [])

const meetingsDatasetUnroll = useState('meetingsDatasetUnroll', () => [])
const documentsDataset = useState('documentsDataset', () => [])
const materialDataset = useState('materialDataset', () => [])

const lettersDataset = useState('lettersDataset', () => [])



// iterator to bypass Airtable limit to 100 entries
function iterCalls(iterator, table, offset, data, trigger) {
  if (offset.value !== undefined) {
    callAtTable(appConfig.atToken, appConfig.atApp, table, offset.value).then((res) => {
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
  iterCalls(iterator, appConfig.atTableLocations, offsetLocations, dataLocations, triggerLocations)
  iterCalls(iterator, appConfig.atTableMeetings, offsetMeetings, dataMeetings, triggerMeetings)
  iterCalls(iterator, appConfig.atTableDocuments, offsetDocuments, dataDocuments, triggerDocuments)
  iterCalls(iterator, appConfig.atTableMaterial, offsetMaterial, dataMaterial, triggerMaterial)
  iterCalls(iterator, appConfig.atTablePeople, offsetPeople, dataPeople, triggerPeople)
})

// mapMeetingsDataset
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
    mapMeetingsDataset.value = tMeetingsComplete.groupby('createdLoc').rollup({
      city: aq.op.max('Name'),
      source: aq.op.max('Document (evidence of meeting)'),
      participants: aq.op.max('ID (from Participants)'),
      dateStart: aq.op.array_agg('Start date'),
      notes: aq.op.array_agg('Summary'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();

    console.log('map meetings ready')
  }
})

// mapCorrespondenceDataset
watch(() => [triggerLocations.value, triggerMaterial.value], () => {

  if (offsetLocations.value == undefined && offsetMaterial.value == undefined) {

    const locations = dataLocations.value.map(x => x.fields)
    locations.forEach((location, i) => {
      location['createdLoc'] = dataLocations.value[i].id
    })

    /*
    const meetings = dataMeetings.value.map(x => x.fields)
    meetings.forEach((meeting, index) => {
      if (meeting['Location'] != undefined) {
        meeting['createdLoc'] = meeting['Location'][0]
      }
    })
    const tLocations = aq.from(locations)
    const tMeetings = aq.from(meetings)

    const tCorrespondenceComplete = tMeetings.join(tLocations, 'createdLoc')
    mapCorrespondenceDataset.value = tCorrespondenceComplete.groupby('createdLoc').rollup({
      city: aq.op.max('Name'),
      source: aq.op.max('Document (evidence of meeting)'),
      participants: aq.op.max('ID (from Participants)'),
      dateStart: aq.op.array_agg('Start date'),
      notes: aq.op.array_agg('Summary'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();

    */
  }

  // lettersDataset.value = tMaterial.objects().filter(x => x.Type == 'Letter')
  console.log('map correspondence ready')
  
})

// forTimeline: Meetings, Documents, Material
// each table should be flattened to have one entry per Meeting/Documents/Material per Author
watch(() => [triggerMeetings.value, triggerDocuments.value, triggerMaterial.value, triggerPeople.value], () => {
  if (offsetMeetings.value == undefined 
      && offsetDocuments.value == undefined 
      && offsetMaterial.value == undefined 
      && offsetPeople.value == undefined) {
    
    // create people table: sort by Nationality to prevent
    // the base array to skip the Nationality field
    const people = dataPeople.value.sort((a, b) => {
      if (a.fields.Nationality == undefined) {
        return 1;
      } else {
        return 0
      };
    }).map(x => x.fields)
    people.forEach((person, i) => {
      person['createdPerson'] = dataPeople.value[i].id
    })
    const tPeople = aq.from(people)

    const locations = dataLocations.value.map(x => x.fields)
    locations.forEach((location, i) => {
      location['createdLocIn'] = dataLocations.value[i].id
      location['createdLocOut'] = dataLocations.value[i].id
    })

    const tLocations = aq.from(locations)

    peopleDataset.value = tPeople.objects()

    // each table should have the same colums
    const meetings = dataMeetings.value.map(x => x.fields)
    let tMeetings = aq.from(meetings)
    let tMeetingsUnroll = aq.from(meetings).unroll('Participants')

    const documents = dataDocuments.value.map(x => x.fields)
    let tDocuments = aq.from(documents).unroll('Author')
    const material = dataMaterial.value.sort((a, b) => {
      if (
        a.fields['Location written (if letter)'] == undefined 
        || 
        a.fields['Location received (if individual letter)'] == undefined 
        || 
        a.fields['Summary'] == undefined
      ) {
        return 1;
      } else {
        return 0
      };
    }).map(x => x.fields)

    material.forEach((material, index) => {
      if (material['Location'] != undefined) {
        material['createdLocIn'] = material['Location written (if letter)'][0]
        material['createdLocOut'] = material['Location received (if individual letter)'][0]
      }
    })

    let tMaterial = aq.from(material).unroll('Agent')

    tMeetings = tMeetings.derive({ authorUnified: d => d['Participants'] })
    tMeetingsUnroll = tMeetingsUnroll.derive({ authorUnified: d => d['Participants'] })
    tDocuments = tDocuments.derive({ authorUnified: d => d['Author'] })
    tMaterial = tMaterial.derive({ authorUnified: d => d['Agent'] })

    meetingsDataset.value = tMeetings.objects()
    meetingsDatasetUnroll.value = tMeetingsUnroll.objects()
    documentsDataset.value = tDocuments.objects()
    materialDataset.value = tMaterial.objects()

    console.log('timeline ready')
    
  }
})


</script>