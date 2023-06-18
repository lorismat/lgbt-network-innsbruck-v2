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
  <div class="pt-4 pb-12">
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
      options-class="flex gap-8"
      wrapper-class="!items-end"
    />
    <pre wrap>{{ selectedEvents }}</pre>

    <div class="border-gray-900 my-2" id="timeline"></div>
    <div class="p-48"></div>
  </div>
</template>

<script setup>
// using timeline standalone build 
// https://visjs.github.io/vis-timeline/examples/timeline/

const selectedEvents = ref(['Meetings', 'Material Exchanges', 'Publications'])

const author = ref('')
const authorInfo = ref('')
const allAuthors = ref([''])

const popupDescription = ref('')
const popupTimelineVisible = useState('popupTimelineVisible', () => false)

const peopleDataset = useState('peopleDataset')
const meetingsDatasetUnroll = useState('meetingsDatasetUnroll')
const documentsDataset = useState('documentsDataset')
const materialDataset = useState('materialDataset')

const timelineDataset = ref([
  { id: 1, content: "item 1", start: "2014-04-20" },
  { id: 2, content: "item 2", start: "2014-04-14" },
  { id: 3, content: "item 3", start: "2014-04-18" },
  { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
  { id: 5, content: "item 5", start: "2014-04-25" },
  { id: 6, content: "item 6", start: "2014-04-27", type: "point" }
])


onMounted(() => {
  allAuthors.value = peopleDataset.value.filter(x => x['Date of birth'] != undefined && x['Date of death'] != undefined).map(x => x.ID)
})

watch(() => author.value, (newValue, oldValue) => {
  const container = document.getElementById('timeline')
  container.innerHTML = ''
  const vals = peopleDataset.value.filter(x =>  x.ID == author.value)[0]
  
  authorInfo.value = {
    name: vals['ID'],
    dob: vals['Date of birth'],
    dod: vals['Date of death'], 
    occupation: vals['Occupation'],
    orientation: vals['Sexual orientation']
  }

  const itemsArray = []
  
  if (vals['Date of birth'] != undefined) {
    itemsArray.push(
      { id: 'dob', content: "DOB", start: vals['Date of birth'], className: 'metaClass gray', showMajorLabels: false }
    )
  }

  if (vals['Date of death'] != undefined) {
    itemsArray.push(
      { id: 'dod', content: "DOD", start: vals['Date of death'], className: 'metaClass gray',  showMajorLabels: false }
    )
  }

  const meetings = meetingsDatasetUnroll.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<meetings.length; i++) {
    if (meetings[i]['Start date'] != undefined && meetings[i]['Summary'] != undefined) {
      itemsArray.push(
        { 
          id: 'meeting-' + i, 
          content: meetings[i]['Summary'].slice(0,20) + '...', 
          title: meetings[i]['Summary'].slice(0,50), 
          start: meetings[i]['Start date'], 
          className: 'metaClass beige',
          description: meetings[i]['Summary'],  
        }
      )
    }
  }

  const documents = documentsDataset.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<documents.length; i++) {
    if (documents[i]['Year of publication (original)'] != undefined) {
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
    if (material[i]['Start date of activity'] != undefined) {
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
      console.log('template', element, data)
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
    //height: '600px',
    min: lowerBound, // lower limit of visible range
    max: upperBound, // upper limit of visible range
    // zoomMin: 1000 * 60 * 60 * 24, // one day in milliseconds
    // zoomMax: 1000 * 60 * 60 * 24 , // about three months in milliseconds
  };

  const items = new vis.DataSet(itemsArray)  
  const timeline = new vis.Timeline(container, items, options)

  timeline.on("select", function (e) {
    const el = document.getElementById(e.items[0])  
    console.log(el, e)
    popupTimelineVisible.value = true;
    popupDescription.value = el.dataset.description;

  });

  
})

function visItemOnClick() {
  console.log('clicked')
}


</script>

<style>

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
  border: 2px solid #444;
  border-style: dotted;
  border-radius: 4px;
}
</style>