<template>
  <div>
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

      <div class="text-lg  max-w-2xl text-center text-justify mx-auto">
        This project visualizes the global connections between twentieth-century LGBTQ+ exile writers by tracing their movement and creative exchanges across space and time in a series of interactive maps, graphs, and timelines.
      </div>
    </div>

    <div class="grid grid-cols-6 gap-10 pb-4">
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
    "title": "Visualizing the Scope of the Network",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi.",
    "image": "images/graphs/placeholder.png",
    "url": "/visualizations/scope-network", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Visualizing by Authors",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi.",
    "image": "images/graphs/1.png",
    "url": "/visualizations/sankey", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Visualizing by Locations",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi.",
    "image": "images/graphs/placeholder.png",
    // "url": "/visualizations/map-meetings", 
    "colSpan": "col-span-2"
  }
]

</script>