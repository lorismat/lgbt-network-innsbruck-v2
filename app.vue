<template>
  <div>
    <Data/>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
  
</template>

<script setup>
useHead({
  script: [
    {
      src: '/libs/vis/vis-timeline-graph2d.min.js',
      type: 'text/javascript'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: '/libs/vis/vis-timeline-graph2d.min.css',
      type: 'text/css'
    }
  ]
})

useHead({
  script: [
    {
      src: '/libs/leaflet/leaflet.js'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: '/libs/leaflet/leaflet.css'
    }
  ]
})

useHead({
  script: [
    {
      src: '/libs/leaflet-marker-cluster/leaflet.markercluster.js'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: '/libs/leaflet-marker-cluster/MarkerCluster.css'
    },
    {
      rel: 'stylesheet',
      href: '/libs/leaflet-marker-cluster/MarkerCluster.Default.css'
    },
  ]
})

</script>