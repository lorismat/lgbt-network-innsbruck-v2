<template>
  <HeaderViz />
  <div class="p-8 bg-gray-100 my-8">
    <FormKit
      v-model="author"
      type="select"
      label="Select an Author"
      name="author"
      :options="allAuthors"
    />
    <div class="py-4 px-2 my-4 bg-gray-200">
      {{ author.name }}
    </div>
    <div class="py-12">
      {{ nodes }}
    </div>
    <div class="py-12">
      {{ edges }}
    </div>
    <div class="py-12">
      {{ another }}
    </div>
  </div>
</template>

<script setup>

const author = ref({
  "label": "Christopher Isherwood",
  "value": {
    "name": "Christopher Isherwood",
    "id": "recEINIUFNENSS"
  }
})
const allAuthors = ref([''])
const nodes = ref([])
const edges = ref([])
const another = ref([])


const peopleDataset = useState('peopleDataset')
const meetingsDataset = useState('meetingsDataset')

onMounted(() => {
  allAuthors.value = peopleDataset.value.map(function(d) {
    return {
      "label": d['ID'],
      "value": {
        "name": d['ID'],
        "id": d['createdPerson']
      }
    }
  })
})

watch(() => author.value, (newValue, oldValue) => {

  meetingsDataset.value.filter(x => x.Participants.includes(author.value.id)).forEach(d => {
    console.log('meetings with d', d)
    nodes.value.push(d['ID (from Participants)'])
  })
  nodes.value = Array.from(new Set(nodes.value.flat()))

  // list all encounters
  // for every node, list all encounters with other nodes
  // remove duplicates
  // create an array of array

  edges.value = []
  console.log('edges', edges.value)
  
  nodes.value.forEach((d, idx) => {
    for (let i = 0; i < meetingsDataset.value.length; i++) {
      if (meetingsDataset.value[i]['ID (from Participants)'].includes(author.value.name)) {
        edges.value.push(meetingsDataset.value[i]['ID (from Participants)'])
      }
    }
  })

  another.value = []
})

</script>