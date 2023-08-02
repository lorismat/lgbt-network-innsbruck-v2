<template>
  <div>

    <!-- INTRO -->
    <div class="mb-24">
      
      <div class="pt-16">
        <div class="py-2 text-5xl max-w-2xl text-center mx-auto text-gray-800">
          Networks of Anglophone LGBTQ Exile Writers
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

      <div class="text-sm py-4 max-w-2xl text-center text-justify mx-auto">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi. Aliquam tristique mauris in magna commodo venenatis. Sed ac eros nulla. Mauris dui risus, accumsan eu lacinia a, malesuada id justo. Proin lacinia gravida varius. Integer sed velit commodo, suscipit velit a, laoreet tortor. Phasellus molestie, lacus ut convallis dignissim, mi metus gravida ante, eu porttitor felis purus placerat sapien. Cras vel felis at quam laoreet aliquet ac sed mauris. Cras posuere eget nisi sit amet consectetur. Sed aliquet pellentesque ante. Nullam ut hendrerit purus, ac finibus elit. Proin in orci ac tellus scelerisque commodo id ac eros. Nulla sit amet lacus ut velit bibendum facilisis vitae nec neque.
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
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/1.png",
    "url": "/visualizations/sankey", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Timeline of Author Meetings and Material Exchanges",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/2.png",
    "url": "/visualizations/timeline", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Map of Author Meetings",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/3.png",
    "url": "/visualizations/map-meetings", 
    "colSpan": "col-span-2"
  },
  {
    "title": "Map of Correspondence Between Authors",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/4.png",
    "url": "/visualizations/map-correspondence", 
    "colSpan": "col-start-2 col-end-4"
  },
  {
    "title": "Force-Directed Graph of Meetings and Exchanges",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/5.png",
    "url": "/visualizations/directed", 
    "colSpan": "col-start-4 col-end-6"
  }
]

</script>