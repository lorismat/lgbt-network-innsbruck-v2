<template>
  <HeaderViz />
  <TimelineTooltip 
    :description="popupDescription"
  />
  <BaseContent 
    title="Timeline of Author Meetings and Material Exchanges"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />
  <div class="pt-8 pb-12">
    <div class="text-red-600 capitalize py-4">data inside the pop is not yet aggregated</div>
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

const author = useState('author')
const authorInfo = ref('')
const allAuthors = ref([''])

const popupDescription = ref('')
const popupTimelineVisible = useState('popupTimelineVisible', () => false)

const peopleDataset = useState('peopleDataset')
const meetingsDatasetUnroll = useState('meetingsDatasetUnroll')
const documentsDataset = useState('documentsDataset')
const materialDataset = useState('materialDataset')

onMounted(() => {
  allAuthors.value = peopleDataset.value.filter(x => x['Date of birth'] != undefined && x['Date of death'] != undefined).map(x => x.ID_1)
  allAuthors.value.push('')
})

watch(() => [author.value, selectedEvents.value], (newValue, oldValue) => {

  const container = document.getElementById('timeline')
  container.innerHTML = ''
  const vals = peopleDataset.value.filter(x =>  x.ID_1 == author.value)[0]

  console.log('vals', vals);
  
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

  const meetings = meetingsDatasetUnroll.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<meetings.length; i++) {
    if (meetings[i]['Start date'] != undefined && meetings[i]['Summary'] != undefined && selectedEvents.value.includes('Meetings')) {
      
      console.log('meet',meetings[i]);
      const participants = meetings[i]['Participants'];
      const cityMeeting = meetings[i]['Location'][0];
      
      itemsArray.push(
        { 
          id: 'meeting-' + i, 
          content: `Meeting with ${participants} in ${cityMeeting}`, 
          title: meetings[i]['Summary'].slice(0,50), 
          start: meetings[i]['Start date'], 
          className: 'metaClass beige',
          description: `Meeting with ${participants} in ${cityMeeting}`,  
        }
      )
    }
  }

  const documents = documentsDataset.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<documents.length; i++) {
    if (documents[i]['Year of publication (original)'] != undefined && selectedEvents.value.includes('Publications')) {
      itemsArray.push(
        { 
          id: 'document-' + i, 
          content: documents[i]['Title'].slice(0, 20), 
          title: documents[i]['Title'].slice(0, 50), 
          start: documents[i]['Year of publication (original)'], 
          className: 'metaClass light-brown',
          description: documents[i]['Title'],  
        }
      )
    }
  }

  const material = materialDataset.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<material.length; i++) {
    if (material[i]['Start date of activity'] != undefined && selectedEvents.value.includes('Material Exchanges')) {
      itemsArray.push(
        { 
          id: 'material-' + i, 
          content: material[i]['Type'].slice(0, 20), 
          start: material[i]['Start date of activity'], 
          className: 'metaClass dark-brown',
          description: material[i]['Type'],
        }
      )
    }
  }

  let lowerBound = vals['Date of birth'];
  let upperBound = vals['Date of death'];

  lowerBound = (Number(lowerBound.split('-')[0]) - 20).toString() + '-01-01';
  upperBound = (Number(upperBound.split('-')[0]) + 20).toString() + '-01-01';

  const options = {
    template: function (item, element, data) {
      const html = `
        <div 
          id='${data.id}' 
          data-description='${data.description}'
        >
          ${item.content}
        </div>`

      return html;
    },
    xss: {
      disabled: false,
      filterOptions: {
        whiteList: { div: ['class', 'id', 'data-description'] }
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
      popupDescription.value = el.dataset.description
      popupTimelineVisible.value = true
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