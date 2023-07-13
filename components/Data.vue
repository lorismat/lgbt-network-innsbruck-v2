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
const mapCorrespondenceDatasetIn = useState('mapCorrespondenceDatasetIn', () => [])
const mapCorrespondenceDatasetOut = useState('mapCorrespondenceDatasetOut', () => [])
const peopleDataset = useState('peopleDataset', () => [])
const sankeyMeetings = useState('sankeyMeetings', () => [])
const directedMeetings = useState('directedMeetings', () => [])

// temp dataset
const tempDataset = useState('tempDataset', () => [])
const meetingsDataset = useState('meetingsDataset', () => [])

const meetingsDatasetUnroll = useState('meetingsDatasetUnroll', () => [])
const documentsDataset = useState('documentsDataset', () => [])
const materialDataset = useState('materialDataset', () => [])

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

// mapSankeyDataset
watch(() => [triggerLocations.value, triggerMeetings.value], () => {
  const tempTableLinks = aq.table({ source: ['a', 'a', 'a', 'b', 'b', 'c'], target: ['london', 'paris', 'ny', 'london', 'paris', 'ny'], value: [124, 26, 100, 280, 81, 10] })
  const tempTableNodes = aq.table({ name: ['a', 'b', 'c', 'london', 'paris', 'ny'], category: ['aut', 'aut', 'aut', 'city', 'city', 'city'] })
  tempDataset.value = {
    'nodes': tempTableNodes.objects(),
    'links': tempTableLinks.objects()
  }

  // process: 
  // get the meeting table
  // unroll by participants
  // join with the People table to get participants info
  // join with locations to get the places info
  // group by meetings (array of participants)

  // format in a nodes/links pattern

  const meetings = dataMeetings.value.map(x => x.fields)
  const locations = dataLocations.value.map(x => x.fields)
  const people = dataPeople.value.map(x => x.fields)

  locations.forEach((location, i) => {
    location['createdLoc'] = dataLocations.value[i].id
  })
  people.forEach((people, i) => {
    people['participant_rec'] = dataPeople.value[i].id
  })
  meetings.forEach((meeting, index) => {
    if (meeting['Location'] != undefined) {
      meeting['createdLoc'] = meeting['Location'][0]
      meeting['participant_rec'] = meeting['Participants']
    }
  })

  const tLocations = aq.from(locations)
  const tMeetings = aq.from(meetings)
  const tPeople = aq.from(people)
  let tMeetingsUnroll = aq.from(meetings).unroll('participant_rec')

  const tMeetingsUnrollLocated = tMeetingsUnroll.join(tLocations, 'createdLoc')
  const tMeetingsUnrollLocatedParticipants = tMeetingsUnrollLocated.join(tPeople, 'participant_rec')

  // ID_1 is the meeting ID
  const groupedMeetingsAll = tMeetingsUnrollLocatedParticipants.groupby('ID_1').rollup({
      city: aq.op.max('Name'),
      source: aq.op.max('Document (evidence of meeting)'),
      participants: aq.op.array_agg('ID'),
      dateStart: aq.op.max('Start date'),
      notes: aq.op.max('Summary'),
    }).objects();

  console.log('tMeetingsUnrollLocated', groupedMeetingsAll)

  sankeyMeetings.value = groupedMeetingsAll;
  directedMeetings.value = groupedMeetingsAll;

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

  }
})

// mapCorrespondenceDataset In/Out
watch(() => [triggerMaterial.value], () => {

  if (offsetLocations.value == undefined && offsetMaterial.value == undefined) {
    const locations = dataLocations.value.map(x => x.fields)
    locations.forEach((location, i) => {
      location['createdLocIn'] = dataLocations.value[i].id
      location['createdLocOut'] = dataLocations.value[i].id
    })
    
    let materials = dataMaterial.value.sort((a, b) => {
      if (
        a.fields['Location written (if letter)'] == undefined || 
        a.fields['Location received (if individual letter)'] == undefined ||  
        a.fields['Summary'] == undefined
      ) {
        return 1;
      } else {
        return -1
      };
    }).map(x => x.fields)

    materials.forEach((material, index) => {
      if (material['Location written (if letter)'] != undefined) {
        material['createdLocIn'] = material['Location written (if letter)'][0]
      }
      if (material['Location received (if individual letter)'] != undefined) {
        material['createdLocOut'] = material['Location received (if individual letter)'][0]
      }
    })

    materials = materials.sort((a, b) => {
      if (a['createdLocIn'] == undefined || a['createdLocOut'] == undefined) {
        return 1;
      } else {
        return -1
      };
    }).filter(d => d['Type'] == 'Letter')
    const tLocations = aq.from(locations)
    const tMaterial = aq.from(materials)

    const tCorrespondenceCompleteIn = tMaterial.join(tLocations, 'createdLocIn')
    const tCorrespondenceCompleteOut = tMaterial.join(tLocations, 'createdLocOut')

    mapCorrespondenceDatasetIn.value = tCorrespondenceCompleteIn.groupby('createdLocIn').rollup({
      city: aq.op.max('Name'),
      source: aq.op.max('Document'),
      agent: aq.op.max('Agent'),
      dateStart: aq.op.array_agg('Start date of activity'),
      notes: aq.op.array_agg('Summary'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();

    mapCorrespondenceDatasetOut.value = tCorrespondenceCompleteOut.groupby('createdLocOut').rollup({
      city: aq.op.max('Name'),
      source: aq.op.max('Document'),
      agent: aq.op.max('Agent'),
      dateStart: aq.op.array_agg('Start date of activity'),
      notes: aq.op.array_agg('Summary'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();
    
  }

  // lettersDataset.value = tMaterial.objects().filter(x => x.Type == 'Letter')
  
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
      if (
        a.fields.Nationality == undefined || 
        a.fields['Place of birth'] == undefined || 
        a.fields['Place of death'] == undefined  
      ) {
        return 1
      } else {
        return -1
      };
    }).map(x => x.fields)

    people.forEach((person, i) => {
      person['createdPerson'] = dataPeople.value[i].id
      if (dataPeople.value[i].fields['Place of birth'] != undefined) {
        person['pob'] = dataPeople.value[i].fields['Place of birth'][0]
      }
      if (dataPeople.value[i].fields['Place of death'] != undefined) {
        person['pod'] = dataPeople.value[i].fields['Place of death'][0]
      }
    })
    const tPeople = aq.from(people)

    const locations = dataLocations.value.map(x => x.fields)
    locations.forEach((location, i) => {
      location['createdLocIn'] = dataLocations.value[i].id
      location['createdLocOut'] = dataLocations.value[i].id
      location['pob'] = dataLocations.value[i].id
      location['pod'] = dataLocations.value[i].id
    })

    const tLocationsBirth = aq.from(locations)
    const tLocationsDeath = aq.from(locations)

    let tPeopleComplete = tPeople.join_left(tLocationsBirth, 'pob')
 
    peopleDataset.value = tPeopleComplete.objects()

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
    console.log('meetings', meetingsDataset.value,  meetingsDatasetUnroll.value);
    documentsDataset.value = tDocuments.objects()
    materialDataset.value = tMaterial.objects()

    
  }
})


</script>