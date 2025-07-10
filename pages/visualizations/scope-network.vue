<template>
  <HeaderViz />
  <SectionSubtitle 
    text="In this section, you can visualize the LGBTQ+ network as a whole."
  />

  <div class="pb-16">
    <div class="text-xl text-center border-b border-gray-600 pb-2 border-dashed">
      Key Figures
    </div>
  </div>

  <BaseLoader :displayLoader="displayLoader" padding="py-44" />


  <div v-if="displayLoader != 'block' ">
    <div class="mx-auto max-w-xl grid grid-cols-3 gap-2">
      <div class="text-center" v-for="figure in figures">
        <div>{{ figure.title }}</div>
        <div>{{ figure.number }}</div>
      </div>
    </div>
  </div>
    
</template>

<script setup>

const allAuthors = useState('allAuthors')
const displayLoader = ref('block')

const figures = useState('figures', () => [
  {
    "title": "Writers",
    "number": "..."
  },
  {
    "title": "Countries of Birth",
    "number": 0
  },
  {
    "title": "Countries of Exile",
    "number": 0
  },
  {
    "title": "Meetings",
    "number": 0
  },
  {
    "title": "Publications",
    "number": 0
  },
  {
    "title": "Letters Exchanged",
    "number": 0
  }
])

watch(() => allAuthors.value, (newValue, oldValue) => {
  displayLoader.value = 'none';
  figures.value[0].number = allAuthors.value.length;
})
onMounted(() => {
  if (allAuthors.value.length > 0) {
    displayLoader.value = 'none';
  }
})

// const allAuthors = useState('allAuthors', () => [])
//  allAuthors.value = peopleDataset.value.filter(x => x['Date of birth'] != undefined && x['Date of death'] != undefined).map(x => x.ID_1)

/*
const figures = ref([
  {
    "title": "Writers",
    "number": "..."
  },
  {
    "title": "Countries of Birth",
    "number": 0
  },
  {
    "title": "Countries of Exile",
    "number": 0
  },
  {
    "title": "Meetings",
    "number": 0
  },
  {
    "title": "Publications",
    "number": 0
  },
  {
    "title": "Letterx Exchanged",
    "number": 0
  }
])
*/

</script>