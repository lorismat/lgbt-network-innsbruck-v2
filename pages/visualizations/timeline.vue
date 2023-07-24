<template>
  <HeaderViz />
  <Tooltip 
    :description="popupDescription"
    :title="popupTitle"
  />
  <BaseContent 
    title="Timeline of Author Meetings and Material Exchanges"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />
  <div class="py-12">
    <FormKit
      v-model="author"
      type="select"
      label="Select an Author"
      name="author"
      inner-class="ring-0 focus-within:ring-gray-500"
      :options="allAuthors"
    />

    <AuthorCard 
      :authorInfo="authorInfo"
    />

    <FormKit
      v-model="selectedEvents"
      type="checkbox"
      label=" "
      :options="['Meetings', 'Material Exchanges', 'Publications']"
      help=" "
      outer-class="mt-12 !mb-0"
      fieldset-class="border-0"
      options-class="flex gap-8"
      wrapper-class="!items-end border-0"
      decorator-class="text-gray-500 peer-checked:ring-gray-500 peer-checked:text-gray-500"
    />

    <div class="border-2 border-gray-800 rounded-md border-dotted">
      <div class="p-2 flex justify-end gap-4">
        <div class="flex items-end">
          <svg class="w-4 h-4 inline-block">
            <circle cx="6" cy="6" r="6" fill="var(--beige)" />
          </svg>
          <span class="text-beige text-sm font-bold">Meetings</span>
        </div>
        <div>
          <svg class="w-4 h-4 inline-block">
            <circle cx="6" cy="6" r="6" fill="var(--dark-brown)" />
          </svg>
          <span class="text-dark-brown text-sm font-bold">Material Exchanges</span>
        </div>
        <div>
          <svg class="w-4 h-4 inline-block">
            <circle cx="6" cy="6" r="6" fill="var(--light-brown)" />
          </svg>
          <span class="text-light-brown text-sm font-bold">Publications</span>
        </div>
      </div>
      <div class="my-2" id="timeline"></div>
    </div>
    
    <div class="p-48"></div>
  </div>
</template>

<script setup>
// using timeline standalone build 
// https://visjs.github.io/vis-timeline/examples/timeline/

const selectedEvents = ref(['Meetings', 'Material Exchanges', 'Publications'])

const author = ref('')
const authorInfo = ref('')
const allAuthors = useState('allAuthors')


const popupDescription = ref('')
const popupTitle = ref('')

const popupVisible = useState('popupVisible', () => false)

const peopleDataset = useState('peopleDataset')
const meetingsDatasetUnroll = useState('meetingsDatasetUnroll')

const meetingsAgg = useState('meetingsAgg')
const documentsDataset = useState('documentsDataset')
const materialDataset = useState('materialDataset')

watch(() => [author.value, selectedEvents.value], (newValue, oldValue) => {

  const container = document.getElementById('timeline')
  container.innerHTML = ''
  const vals = peopleDataset.value.filter(x =>  x.ID_1 == author.value)[0]
  
  authorInfo.value = {
    name: vals['ID_1'],
    dob: vals['Date of birth'],
    dod: vals['Date of death'], 
    occupation: vals['Occupation'],
    orientation: vals['Sexual orientation']
  }

  const itemsArray = []
  const pod = ''

  if (vals['Date of birth'] != undefined) {
    let pob = ''
    if (vals['Name'] != undefined) {
      pob = '(' + vals['Name'] + ')'
    }
    itemsArray.push(
      { id: 'dob', content: `Date of Birth ${pob}`, start: vals['Date of birth'], className: 'metaClass gray', showMajorLabels: false }
    )
  }

  if (vals['Date of death'] != undefined) {
    itemsArray.push(
      { id: 'dod', content: `Date of Death`, start: vals['Date of death'], className: 'metaClass gray',  showMajorLabels: false }
    )
  }  

  let meetings = []
  meetings = meetingsAgg.value.filter(x => x['participants'].includes(author.value))
  
  for (let i = 0; i<meetings.length; i++) {
    if (meetings[i]['dateStart'] != undefined && meetings[i]['location'] != undefined &&  meetings[i]['notes'] != undefined && selectedEvents.value.includes('Meetings')) {
      
      let participants = meetings[i]['participants'].filter(x => x != author.value);

      if (participants.length === 2) {
        participants = participants.join(' and ')
      } else if (participants.length > 2) {
        participants = participants.join(', ')
      }
      const cityMeeting = meetings[i]['location'];

      itemsArray.push(
        { 
          id: 'meeting-' + i, 
          content: `Meeting with ${participants} in ${cityMeeting}`, 
          title: meetings[i]['notes'].slice(0,50), 
          start: meetings[i]['dateStart'], 
          dateStart: meetings[i]['dateStart'],
          dateEnd: meetings[i]['dateEnd'], 
          participants: meetings[i]['participants'].join(', '), 
          className: 'metaClass beige',
          description: `Meeting with ${participants} in ${cityMeeting}`, 
          source: meetings[i]['source'],
          page: meetings[i]['page'],
          notes: meetings[i]['notes'],
        }
      )
    }
  }

  // publication
  const documents = documentsDataset.value.filter(x => x['author'] == vals.createdPerson)
  for (let i = 0; i<documents.length; i++) {
    if (documents[i]['pubYear'] != undefined && selectedEvents.value.includes('Publications')) {
      itemsArray.push(
        { 
          id: 'document-' + i, 
          content: documents[i]['title'], 
          title: documents[i]['title'],  // 
          start: documents[i]['pubYear'], 
          dateStart: documents[i]['pubYear'], 
          className: 'metaClass light-brown',
          description: documents[i]['title'], 
          notes: documents[i]['notes'], 
          pub: documents[i]['pub'], 
        }
      )
    }
  }

  const material = materialDataset.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<material.length; i++) {
    if (material[i]['dateStart'] != undefined && selectedEvents.value.includes('Material Exchanges')) {
      
      let content = '';

      if (material[i]['type'] === 'Letter') {
        content = `Letter to ${material[i]['participants']}`
      } else if (material[i]['type'] === 'Allusion' && material[i]['document'] != undefined && material[i]['participants'].length === 0) {
        content = `Allusion to ${material[i]['document'].split(':')[0].split('by')[0]}`
      } else if (material[i]['type'] === 'Viewing' && material[i]['document'] != undefined && material[i]['participants'].length === 0) {
        content = `Viewing of ${material[i]['document'].split(':')[0].split('by')[0]}`
      } else if (material[i]['type'] === 'Allusion' && material[i]['participants'].length > 0) {
        content = `Allusion to ${material[i]['participants'].join(', ')}`
      } else if (material[i]['type'] === 'Reading') {
        content = `Reading of ${material[i]['document'].split(':')[0].split('by')[0]}`
      } else if (material[i]['type'] === 'Review') {
        content = `Review of ${material[i]['document'].split(':')[0].split('by')[0]}` // ${material[i]['document'][0]
      } else {
        content = material[i]['type']
      }
      itemsArray.push(
        { 
          id: 'material-' + i, 
          content: content, 
          start: material[i]['dateStart'], 
          dateStart: material[i]['dateStart'],
          dateEnd: material[i]['dateEnd'], 
          className: 'metaClass dark-brown',
          description: content,
          source: material[i]['source'],
          page: material[i]['page'],
          notes: material[i]['notes'],
        }
      )
    }
  }

  let lowerBound = vals['Date of birth'];
  let upperBound = vals['Date of death'];

  lowerBound = (Number(lowerBound.split('-')[0]) - 20).toString() + '-01-01';
  upperBound = (Number(upperBound.split('-')[0]) + 20).toString() + '-01-01';

  // IMPORTANT NOTE
  // Element of the "Object Dataset" have to be whitelisted below

  const options = {
    template: function (item, element, data) {
      const html = `
        <div 
          id='${data.id}' 
          data-description='${data.description}'
          data-date-start='${data.dateStart}'
          data-date-end='${data.dateEnd}'
          data-source='${data.source}'
          data-page='${data.page}'
          data-participants='${data.participants}'
          data-notes='${data.notes}'
          data-pub='${data.pub}'
        >
          ${item.content}
        </div>`

      return html;
    },
    xss: {
      disabled: false,
      filterOptions: {
        whiteList: { div: [
          'class', 
          'id', 
          'data-description', 
          'data-date-start', 
          'data-date-end',
          'data-source',
          'data-page',
          'data-participants',
          'data-notes',
          'data-pub'
        ] }
      },
    },
    tooltip: {
      followMouse: true,
      overflowMethod: 'cap'
    },
    maxHeight: '600px',
    min: lowerBound,
    max: upperBound,
  };

  const items = new vis.DataSet(itemsArray)  
  const timeline = new vis.Timeline(container, items, options)

  timeline.on("select", function (e) {
    const el = document.getElementById(e.items[0])  

    if (el.id != 'dob' && el.id != 'dod') {

    const dateStart = el.dataset.dateStart;
    let dateEnd = '';

    let source = '';
    let participants = '';
    let page = '';
    let sourceBlock = '';
    let notes = '';
    let publication = '';
    let main = '';

    if (el.dataset.notes != 'undefined') {
      notes = ": " + el.dataset.notes
    };

    if (el.id.split('-')[0] == 'meeting') { 
      participants = `
        <div><span class='font-sans font-bold'>Participants: </span>${el.dataset.participants}</div>
      `
      // 
    }

    if (el.id.split('-')[0] != 'document') {
      if (el.dataset.dateEnd != 'undefined') {
        dateEnd = ' — ' + el.dataset.dateEnd
      } else {
        dateEnd = ' — ?'
      }
      
      source = el.dataset.source
      page = el.dataset.page
      sourceBlock = `
          <div>
            <span class='font-sans font-bold'>Source: </span>
            <span class='italic'>${source.split('_')[0].split('by')[0]}</span> by <span>${source.split('_')[0].split('by')[1]}</span>
            (p. ${page})
          </div>
          `

      main = `
        <div class="pb-2 my-2 border-b border-dashed border-gray-500 text-sm">
          <div class="py-2">
            <span class='font-sans font-bold'>
              ${dateStart}${dateEnd}
            </span><span class=''>${notes}</span>
          </div>
        `
    } else {
      let publisher = '?'
      if (el.dataset.pub != 'undefined') {
        publisher = el.dataset.pub
      }
      publication = `
          <div>
            <span class='font-sans'>Published by </span>
            <span class='italic'>${publisher}</span>
            in <span class='font-bold'>${dateStart}</span>
          </div>
      `
    }

      popupDescription.value = 
        publication 
      +
        main
      +
        participants
      +
        sourceBlock
      +    
        `
          </div>
        `
      popupTitle.value = el.dataset.description + ` (${dateStart.split('-')[0]})` 
      popupVisible.value = true

    }
  });

  
})

</script>

<style>

.metaClass {
  /* font-size: 10px; */
}

.gray {
  background-color: #e6e6e6;
  border-color: #555;
}

.beige {
  border-color: var(--beige);
  background-color: var(--beige);
}

.dark-brown {
  color: var(--beige);
  border-color: var(--dark-brown);
  background-color: var(--dark-brown);
}

.light-brown {
  color: var(--beige);
  border-color: var(--light-brown);
  background-color: var(--light-brown);
}

.vis-item.vis-selected {
  background-color: white;
  border-color: black;
  color: black;
  box-shadow: 0 0 2px gray;
}

.vis-point {
  border: 0px;
  border-radius: 50px;
}

.vis-item.vis-point.vis-selected {
  background-color: white;
  border-color: black;
  color: black;
  box-shadow: 0 0 2px gray;
}

.vis-item {
  cursor: pointer
}

.vis-timeline {
  margin: 10px 20px;
  border: 0px solid #444;
  border-style: dotted;
  border-radius: 4px;
}
</style>