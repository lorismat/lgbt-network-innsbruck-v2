<template>
  <div>

    <!-- IMAGE -->
    <div class="mx-auto">
      <img class="my-2" src="images/tomb.png" alt="Oscar Wilde's tomb in Paris" />
      <div class="text-gray-500 text-xs">
        Legend Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
    </div>

    <!-- INTRO -->
    <div class="my-12">
      <div class="py-2 text-2xl text-purple-800">
        Networks of Anglophone LGBTQ Exile Writers
      </div>
      <div class="py-2 text-lg text-blue-800">
        From 1900 to 1969
      </div>
      <div class="text-sm max-w-3xl">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi.
      </div>
    </div>

    <div class="grid grid-cols-2 gap-8">
      <div v-for="card in cards">
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

const cards = [
  {
    "title": "Sankey Diagram for Author Meetings",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/1.png",
    "url": "/visualizations/sankey"
  },
  {
    "title": "Timeline of Author Meetings and Material Exchanges",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/2.png",
    "url": "/visualizations/timeline"
  },
  {
    "title": "Map of Author Meetings",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/3.png",
    "url": "/visualizations/map-meetings"
  },
  {
    "title": "Map of Correspondence Between Authors",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/4.png",
    "url": "/visualizations/map-correspondence"
  },
  {
    "title": "Force-Directed Graph of Author Meetings and Material Exchanges",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "image": "images/graphs/5.png",
    "url": "/visualizations/directed"
  }
]

</script>