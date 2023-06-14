<template>
  <div>
    <Data />
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
    },
    {
      src: '/libs/leaflet/leaflet.js',
      type: 'text/javascript'
    },
    {
      src: '/libs/leaflet-marker-cluster/leaflet.markercluster.js',
      type: 'text/javascript'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: '/libs/vis/vis-timeline-graph2d.min.css',
      type: 'text/css'
    },
    {
      rel: 'stylesheet',
      href: '/libs/leaflet/leaflet.css',
      type: 'text/css'
    },
    {
      rel: 'stylesheet',
      href: '/libs/leaflet-marker-cluster/MarkerCluster.css',
      type: 'text/css'
    },
    {
      rel: 'stylesheet',
      href: '/libs/leaflet-marker-cluster/MarkerCluster.Default.css',
      type: 'text/css'
    },
  ]
})
</script>