<template>
  <div>
    <ul class="flex gap-4 p-4 py-8 justify-between">
      <li><NuxtLink activeClass="border-b-2 border-gray-800" class="hover:border-b-2 border-gray-200" to="/visualizations/sankey">Sankey Diagram</NuxtLink></li>
      <li><NuxtLink activeClass="border-b-2 border-gray-800" class="hover:border-b-2 border-gray-200" to="/visualizations/timeline" @click="resetAuthors()">Timeline</NuxtLink></li>
      <li><NuxtLink activeClass="border-b-2 border-gray-800" class="hover:border-b-2 border-gray-200" to="/visualizations/map-meetings">Map Meetings</NuxtLink></li>
      <li><NuxtLink activeClass="border-b-2 border-gray-800" class="hover:border-b-2 border-gray-200" to="/visualizations/map-correspondence">Map Correspondence</NuxtLink></li>
      <li><NuxtLink activeClass="border-b-2 border-gray-800" class="hover:border-b-2 border-gray-200" to="/visualizations/directed">Directed Graph</NuxtLink></li>
    </ul>
  </div>   
</template>

<script setup>

const isViz = useState('isViz')
const author = useState('author', () => {})

onMounted(() => {
  isViz.value = true;
})

function resetAuthors() {
  author.value = ''
}

</script>
