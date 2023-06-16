<template>
  <HeaderViz />
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
      :options="allAuthors"
    />
    <div class="py-4 px-2 my-4 bg-gray-200">
      {{ author }}
    </div>
    <div id="timeline"></div>

    <div class="p-48">

    </div>
  </div>
</template>

<script setup>
// using timeline standalone build 
// https://visjs.github.io/vis-timeline/examples/timeline/

const author = ref('Christopher Isherwood')
const allAuthors = ref([''])

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
const options = {}


onMounted(() => {
  allAuthors.value = peopleDataset.value.filter(x => x['Date of birth'] != undefined).map(x => x.ID)
})

watch(() => author.value, (newValue, oldValue) => {
  const container = document.getElementById('timeline')
  container.innerHTML = ''

  const vals = peopleDataset.value.filter(x =>  x.ID == author.value)[0]
  const itemsArray = []
  
  if (vals['Date of birth'] != undefined) {
    itemsArray.push(
      { id: 'dob', content: "DOB", start: vals['Date of birth'], className: 'purple' }
    )
  }

  if (vals['Date of death'] != undefined) {
    itemsArray.push(
      { id: 'dod', content: "DOD", start: vals['Date of death'], className: 'purple' }
    )
  }

  const meetings = meetingsDatasetUnroll.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<meetings.length; i++) {
    if (meetings[i]['Start date'] != undefined) {
      itemsArray.push(
        { id: 'meeting-' + i, content: "item " + Math.random(), start: meetings[i]['Start date'], className: 'purple' }
      )
    }
  }

  const documents = documentsDataset.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<documents.length; i++) {
    if (documents[i]['Year of publication (original)'] != undefined) {
      itemsArray.push(
        { id: 'document-' + i, content: "item " + Math.random(), start: documents[i]['Year of publication (original)'], className: 'blue' }
      )
    }
  }

  const material = materialDataset.value.filter(x => x['authorUnified'] == vals.createdPerson)
  for (let i = 0; i<material.length; i++) {
    if (material[i]['Start date of activity'] != undefined) {
      itemsArray.push(
        { id: 'material-' + i, content: "item " + Math.random(), start: material[i]['Start date of activity'], className: 'red' }
      )
    }
  }

  const items = new vis.DataSet(itemsArray)  
  const timeline = new vis.Timeline(container, items, options)
  
})


</script>

<style>

.green {
  background-color: green;
}

.purple {
  background-color: purple;
}

.blue {
  background-color: blue;
}

.red {
  background-color: red;
}
</style>