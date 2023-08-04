<template>
  <div></div>
</template>

<script setup>

/* CHROME ft. ARQUERO BUG DESCRIPTION 

In Chrome, data has to be sorted before any join so that the values are defined for column which have to 
be present in the join 
*/

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
const directedMaterial = useState('directedMaterial', () => [])

// allAuthors for dropdown select
const allAuthors = useState('allAuthors', () => [])

const meetingsDataset = useState('meetingsDataset', () => [])
const meetingsAgg = useState('meetingsAgg', () => [])
const documentsDataset = useState('documentsDataset', () => [])
const materialDataset = useState('materialDataset', () => [])

// map meeting trigger
const counterMapMeeting = useState('counterMapMeeting', () => [])
counterMapMeeting.value = 0

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

// sankey + directed meetings + directed material
watch(() => [triggerLocations.value, triggerMeetings.value, triggerMaterial.value], () => {

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
  const material = dataMaterial.value.map(x => x.fields)
  const docs = dataDocuments.value.map(x => x.fields)

  locations.forEach((location, i) => {
    location['createdLoc'] = dataLocations.value[i].id
  })
  people.forEach((people, i) => {
    people['participant_rec'] = dataPeople.value[i].id
  })
  docs.forEach((doc, i) => {
    doc['source'] = dataDocuments.value[i].id
  })
  meetings.forEach((meeting, index) => {
    if (meeting['Location'] != undefined) {
      meeting['createdLoc'] = meeting['Location'][0]
      meeting['participant_rec'] = meeting['Participants']
    }
  })

  material.forEach((material, i) => {
    if (material['Agent'] != undefined) {
      material['participant_rec'] = [material['Agent'][0]]
      if (material['People (if allusion)'] != undefined) {
        material['participant_rec'].push(material['People (if allusion)'][0])
      }
      if (material['Recipient (if letter)'] != undefined) {
        material['participant_rec'].push(material['Recipient (if letter)'][0])
      }
      material['source'] = material['Document'][0]
    }
  })

  // processed in the timeline call, changing material value
  const tMaterial = aq.from(material)
  const tLocations = aq.from(locations)
  const tPeople = aq.from(people)
  const tDocs = aq.from(docs)
  
  let tMeetingsUnroll = aq.from(meetings).unroll('participant_rec')
  let tMaterialUnroll = tMaterial.unroll('participant_rec')

  const tMeetingsUnrollLocated = tMeetingsUnroll.join(tLocations, 'createdLoc')
  const tMeetingsUnrollLocatedParticipants = tMeetingsUnrollLocated.join(tPeople, 'participant_rec')
  let tMaterialUnrollParticipants = tMaterialUnroll.join(tPeople, 'participant_rec')
  tMaterialUnrollParticipants = tMaterialUnrollParticipants.join_left(tDocs, ['source', 'source'], [aq.all(), ['ID']], { 'suffix': ['_source', '_source_2'] })

  // ID_1 is the meeting ID
  const groupedMeetingsAll = tMeetingsUnrollLocatedParticipants.groupby('ID_1').rollup({
      city: aq.op.max('Name'),
      source: aq.op.max('Document (evidence of meeting)'),
      page: aq.op.max('Page number'),
      participants: aq.op.array_agg('ID'),
      dob: aq.op.array_agg('Date of birth'),
      dod: aq.op.array_agg('Date of death'),
      nationality: aq.op.array_agg('Nationality'),
      sexuality: aq.op.array_agg('Sexual orientation'),
      job: aq.op.array_agg('Occupation'),
      dateStart: aq.op.max('Start date'),
      dateEnd: aq.op.max('End date'),
      notes: aq.op.max('Summary'),
    }).objects();

  const groupedMaterialAll = tMaterialUnrollParticipants.groupby('Material Exchange ID').rollup({
    //city: '',
    source: aq.op.max('ID_source_2'),
    page: aq.op.max('Page number'),
    participants: aq.op.array_agg('ID_source'),
    dob: aq.op.array_agg('Date of birth'),
    dod: aq.op.array_agg('Date of death'),
    nationality: aq.op.array_agg('Nationality'),
    sexuality: aq.op.array_agg('Sexual orientation'),
    job: aq.op.array_agg('Occupation'),
    dateStart: aq.op.max('Start date of activity'),
    dateEnd: aq.op.max('End date of activity'),
    notes: aq.op.max('Summary'),
    type: aq.op.max('Type'),
  }).filter(d => d.participants.length > 1).objects();  
  
  sankeyMeetings.value = groupedMeetingsAll;
  directedMeetings.value = groupedMeetingsAll;
  directedMaterial.value = groupedMaterialAll;
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

    const tMeetingsComplete = tMeetings.join_left(tLocations, 'createdLoc')
    mapMeetingsDataset.value = tMeetingsComplete.groupby('createdLoc').rollup({
      city: aq.op.max('Name'),
      source: aq.op.array_agg('Document (evidence of meeting)'),
      participants: aq.op.array_agg('ID (from Participants)'),
      dateStart: aq.op.array_agg('Start date'),
      dateEnd: aq.op.array_agg('End date'),
      page: aq.op.array_agg('Page number'),
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

    materials.forEach((material, index) => {
      material['Document_new'] = material['Document'][0]
      material['Agent_uniq'] = material['Agent'] != undefined ? material['Agent'][0] : ''
      material['Recipient_uniq'] = material['Recipient (if letter)'] != undefined ? material['Recipient (if letter)'][0] : ''
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

    let tCorrespondenceCompleteIn = tMaterial.join(tLocations, 'createdLocIn')
    let tCorrespondenceCompleteOut = tMaterial.join(tLocations, 'createdLocOut')

    locations.forEach((location, i) => {
      location['createdLoc'] = dataLocations.value[i].id
    })

    const documents = dataDocuments.value.map(x => x.fields)
    documents.forEach((document, i) => {
      document['Document_new'] = dataDocuments.value[i].id
    })
    let tDocuments = aq.from(documents)

    tCorrespondenceCompleteIn = tCorrespondenceCompleteIn.join_left(tDocuments, 'Document_new')
    tCorrespondenceCompleteOut = tCorrespondenceCompleteOut.join_left(tDocuments, 'Document_new')

    const peopleAgent = dataPeople.value.sort((a, b) => {
      if ( 
          a.fields['Nationality'] == undefined || 
          a.fields['Date of death'] == undefined
      ) {
        return 1;
      } else {
        return -1
      };
    }).map(x => x.fields)

    peopleAgent.forEach((people, i) => {
      people['agent_id'] = dataPeople.value[i].id
      people['agent_name'] = people['ID']
    })
    const tPeopleAgent = aq.from(peopleAgent)

    const peopleRecipient = dataPeople.value.sort((a, b) => {
      if ( 
          a.fields['Nationality'] == undefined || 
          a.fields['Date of death'] == undefined
      ) {
        return 1;
      } else {
        return -1
      };
    }).map(x => x.fields)
    
    // sorting to avoid missing nationality

    //peopleRecipient

    peopleRecipient.forEach((people, i) => {
      people['recipient_id'] = dataPeople.value[i].id
      people['recipient_name'] = people['ID']
    })
    const tPeopleRecipient = aq.from(peopleRecipient)

    tCorrespondenceCompleteIn = tCorrespondenceCompleteIn.join_left(tDocuments, 'Document_new')
    tCorrespondenceCompleteIn = tCorrespondenceCompleteIn.join_left(tPeopleAgent, ['Agent_uniq','agent_id'])
    tCorrespondenceCompleteIn = tCorrespondenceCompleteIn.join_left(tPeopleRecipient, ['Recipient_uniq','recipient_id'])

    
    mapCorrespondenceDatasetIn.value = tCorrespondenceCompleteIn.groupby('createdLocIn').rollup({
      city: aq.op.max('Name'),
      source: aq.op.array_agg('ID_1'),

      agent: aq.op.array_agg('agent_name_1'),
      agent_dob: aq.op.array_agg('Date of birth_1'),
      agent_dod: aq.op.array_agg('Date of death_1'),
      agent_occupation: aq.op.array_agg('Occupation_1'),
      agent_sexual_orientation: aq.op.array_agg('Sexual orientation_1'),
      agent_nationality: aq.op.array_agg('Nationality_1'),

      recipient: aq.op.array_agg('recipient_name'),
      recipient_dob: aq.op.array_agg('Date of birth_2'),
      recipient_dod: aq.op.array_agg('Date of death_2'),
      recipient_occupation: aq.op.array_agg('Occupation_2'),
      recipient_sexual_orientation: aq.op.array_agg('Sexual orientation_2'),
      recipient_nationality: aq.op.array_agg('Nationality_2'),

      dateStart: aq.op.array_agg('Start date of activity'),
      dateEnd: aq.op.array_agg('End date of activity'),
      notes: aq.op.array_agg('Summary'),
      page: aq.op.array_agg('Page number'),
      count: aq.op.count(),
      lat: aq.op.mean('Latitude'),
      lon: aq.op.mean('Longitude')
    }).objects();

    tCorrespondenceCompleteOut = tCorrespondenceCompleteOut.join_left(tDocuments, 'Document_new')
    tCorrespondenceCompleteOut = tCorrespondenceCompleteOut.join_left(tPeopleAgent, ['Agent_uniq','agent_id'])
    tCorrespondenceCompleteOut = tCorrespondenceCompleteOut.join_left(tPeopleRecipient, ['Recipient_uniq','recipient_id'])

    mapCorrespondenceDatasetOut.value = tCorrespondenceCompleteOut.groupby('createdLocOut').rollup({
      city: aq.op.max('Name'),
      source: aq.op.array_agg('ID_1'),

      agent: aq.op.array_agg('agent_name_1'),
      agent_dob: aq.op.array_agg('Date of birth_1'),
      agent_dod: aq.op.array_agg('Date of death_1'),
      agent_occupation: aq.op.array_agg('Occupation_1'),
      agent_sexual_orientation: aq.op.array_agg('Sexual orientation_1'),
      agent_nationality: aq.op.array_agg('Nationality_1'),

      recipient: aq.op.array_agg('recipient_name'),
      recipient_dob: aq.op.array_agg('Date of birth_2'),
      recipient_dod: aq.op.array_agg('Date of death_2'),
      recipient_occupation: aq.op.array_agg('Occupation_2'),
      recipient_sexual_orientation: aq.op.array_agg('Sexual orientation_2'),
      recipient_nationality: aq.op.array_agg('Nationality_2'),

      dateStart: aq.op.array_agg('Start date of activity'),
      dateEnd: aq.op.array_agg('End date of activity'),
      notes: aq.op.array_agg('Summary'),
      page: aq.op.array_agg('Page number'),
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

    // allAuthors for dropdown select
    allAuthors.value = peopleDataset.value.filter(x => x['Date of birth'] != undefined && x['Date of death'] != undefined).map(x => x.ID_1)
    allAuthors.value.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      else {
        return 1;
      }
    })
    allAuthors.value.push('')

    // each table should have the same colums
    const meetings = dataMeetings.value.map(x => x.fields)
    let tMeetings = aq.from(meetings)
    let tMeetingsUnroll = aq.from(meetings).unroll('Participants')
    
    // material: create a column for people
    // column is an join array of both "Recipients if letter" and "People if Allusion"
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
        return -1
      };
    }).sort((a, b) => {
      if (
        a.fields['Document (if reading, review or allusion)'] == undefined 
      ) {
        return 1;
      } else {
        return -1
      };
    }).map(x => x.fields)

    material.forEach((material, index) => {
      material['reading'] = ''; 
      if (material.Type != 'Reading' && material.Type != 'Review' && material['Document (if reading, review or allusion)'] == undefined) {
        let target = [material['People (if allusion)'], material['Recipient (if letter)']]
        target = [...new Set(target)].filter((e) => {
          return e !== undefined;
        })
        if (target.length > 0) {
          material['target'] = target.flat()
        } else {
          material['target'] = ''
        }
      } else {
        if (material['Document (if reading, review or allusion)'] != undefined) {
          material['reading'] = material['Document (if reading, review or allusion)'][0]; 
          material['target'] = ''
        }
      } 
    })

    material.forEach((material, index) => {
      if (material['Location'] != undefined) {
        material['createdLocIn'] = material['Location written (if letter)'][0]
        material['createdLocOut'] = material['Location received (if individual letter)'][0]
      }
    })

    material.forEach((material, index) => {
      material['docId'] = material['Document'][0]
    })

    // getting all target names
    let tMaterial = aq.from(material)
    tMaterial = tMaterial.unroll('target')
    // join with people table
    tMaterial = tMaterial.join_left(tPeopleComplete, ['target', 'createdPerson'])
    
    // tDocuments
    // documents
    const documents = dataDocuments.value.sort((a, b) => {
      if ( a.fields['Description'] == undefined ) {
        return 1;
      } else {
        return -1
      };
    }).map(x => x.fields);

    documents.forEach((doc, i) => {
      doc['createdDocID'] = dataDocuments.value[i].id
      doc['Source_full'] = doc['ID']
    })

    let tDocuments = aq.from(documents).unroll('Author or editor')
    tDocuments = tDocuments.derive({ authorUnified: d => d['Author or editor'] })
    
    // todo: join data to get reading documents
    tMaterial = tMaterial.join_left(tDocuments, ['reading', 'createdDocID'], [aq.all(), aq.all()], { 'suffix': ['_r', '_r2'] })
    tMaterial = tMaterial.join_left(tDocuments, ['docId', 'createdDocID'], [aq.all(), ['Source_full']], { 'suffix': ['_doc', '_doc2'] })

    // group back
    tMaterial = tMaterial.groupby('Material Exchange ID').rollup({
      type: aq.op.max('Type'),
      source: aq.op.max('Source_full_doc2'),
      page: aq.op.max('Page number'),
      participants: aq.op.array_agg('ID_1'),

      dob: aq.op.array_agg('Date of birth'),
      dod: aq.op.array_agg('Date of death'),
      nationality: aq.op.array_agg('Nationality'),
      sexuality: aq.op.array_agg('Sexual orientation'),
      job: aq.op.array_agg('Occupation'),

      dateStart: aq.op.max('Start date of activity'),
      dateEnd: aq.op.max('End date of activity'),
      notes: aq.op.max('Summary'),
      agent: aq.op.max('Agent'),
      document: aq.op.max('ID'),
    });

    tMaterial = tMaterial.derive({ authorUnified: d => d['agent'] }).objects();
    
    materialDataset.value = tMaterial;

    // source info is missing, join required
    tMeetings = tMeetings.derive({ authorUnified: d => d['Participants'] })
    tMeetingsUnroll = tMeetingsUnroll.derive({ authorUnified: d => d['Participants'] })

    meetingsDataset.value = tMeetings.objects()
    let fullMeetings = tMeetingsUnroll.join_left(tPeople, ['Participants', 'createdPerson'])

    const tLoc = aq.from(locations);
    fullMeetings = fullMeetings.join_left(tLoc, ['createdLoc', 'createdLoc']);

    // group meetings together again (in case more than 2 participants)
    meetingsAgg.value = fullMeetings.groupby('ID_1').rollup({ 
      participants: aq.op.max('ID (from Participants)'),
      dob: aq.op.array_agg('Date of birth'),
      dod: aq.op.array_agg('Date of death'),
      nationality: aq.op.array_agg('Nationality'),
      sexuality: aq.op.array_agg('Sexual orientation'),
      job: aq.op.array_agg('Occupation'),
      source: aq.op.max('Document (evidence of meeting)'),
      dateStart: aq.op.max('Start date'),
      dateEnd: aq.op.max('End date'),
      notes: aq.op.max('Summary'),
      location: aq.op.max('Name'),
      page: aq.op.max('Page number')
    }).objects(); 

    // sort to get description
    documentsDataset.value = tDocuments.groupby('ID').rollup({ 
      author: aq.op.max('authorUnified'),
      title: aq.op.max('Title'),
      pubYear: aq.op.max('Year of publication (original)'),
      notes: aq.op.max('Description'),
      pub: aq.op.max('Publisher'),
    }).objects();
    
  }
})


</script>