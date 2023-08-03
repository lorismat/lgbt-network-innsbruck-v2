<template>
  <div>

    <!-- INTRO -->
    <div class="mb-24">
      
      <div class="pt-16">
        <div class="py-2 text-5xl max-w-2xl text-center mx-auto text-gray-800">
          Networks of Anglophone LGBTQ+ Exile Writers
        </div>
        <div class="py-2 text-lg text-center  text-gray-500">
          From 1900 to 1969
        </div>
      </div>

      <div class="pt-6">
        <div class="py-2 text-blue-800 text-sm text-center">
          With the support of
        </div>
        <img class="w-56 mx-auto" src="/images/logo_fwf.png" alt="logo_FWF"/>
      </div>
      
      <BlockImage />

      <div class="text-sm  max-w-2xl text-center text-justify mx-auto">
        This project visualizes the global connections between twentieth-century LGBTQ+ exile writers by tracing their movement and creative exchanges across space and time in a series of interactive maps, graphs, and timelines.
      </div>
    </div>

    <div class="grid grid-cols-6 gap-4 pb-4">
      <div v-for="card in cards" :class="card.colSpan">
        <BaseCard 
          :title="card.title"
          :description="card.description"
          :image="card.image"
          :url="card.url"
        />
      </div>
    </div>

  </div>
  
</template>

<script setup>

const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

const cards = [
  {
    "title": "Sankey Diagram for Author Meetings",
    "description": "This diagram shows meetings between LGBTQ+ exile writers organized according to location.",
    "image": "images/graphs/1.png",
    "url": "/visualizations/sankey", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Timeline of Author Meetings and Material Exchanges",
    "description": "This timeline shows meetings and creative exchanges between LGBTQ+ exile writers organized according to date.",
    "image": "images/graphs/2.png",
    "url": "/visualizations/timeline", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Map of Author Meetings",
    "description": "This map plots meetings between LGBTQ+ exile writers across the globe.",
    "image": "images/graphs/3.png",
    "url": "/visualizations/map-meetings", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Map of Correspondence Between Authors",
    "description": "This map plots places where letters were exchanged between LGBTQ+ exile writers across the globe.",
    "image": "images/graphs/4.png",
    "url": "/visualizations/map-correspondence", 
    "colSpan": "col-start-2 col-end-4"
  },
  {
    "title": "Force-Directed Graph of Author Meetings and Material Exchanges",
    "description": "This graph shows meetings and creative exchanges between LGBTQ+ exile writers organized according to the relative density of connections.",
    "image": "images/graphs/5.png",
    "url": "/visualizations/directed", 
    "colSpan": "col-start-4 col-end-6"
  }
]

</script>