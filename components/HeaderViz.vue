<template>
  <div class="">
    <ul class="flex my-8 justify-between mb-8 py-4 max-w-lg mx-auto">
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black hover:!border-black" class="py-4 text-sm hover:border-b-4 hover:text-black hover:border-black border-gray-400 text-gray-400" to="/visualizations/scope-network">Scope of the Network</NuxtLink></li>
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black hover:!border-black" class="py-4 text-sm hover:border-b-4 hover:text-black hover:border-black border-gray-400 text-gray-400" to="/visualizations/sankey">By Author</NuxtLink></li>
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black" class="py-4 text-sm border-gray-400 text-gray-400 cursor-text">By Location</NuxtLink></li>
      <!--
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black" class="py-4 text-sm uppercase cursor-text border-gray-400 text-gray-400" @click="resetAuthors()">Timeline</NuxtLink></li>
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black" class="py-4 text-sm uppercase cursor-text border-gray-400 text-gray-400" @click="counterMapClick()">Map of Meetings</NuxtLink></li>
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black" class="py-4 text-sm uppercase cursor-text border-gray-400 text-gray-400">Map of Correspondence</NuxtLink></li>
      <li><NuxtLink activeClass="font-bold !text-black border-b-4 !border-black" class="py-4 text-sm uppercase cursor-text border-gray-400 text-gray-400">Force-Directed Graph</NuxtLink></li>
      -->
    </ul>
  </div>   
</template>

<script setup>

const isViz = useState('isViz')
const author = useState('author', () => {})
const counterMapMeeting = useState('counterMapMeeting')

function counterMapClick() {
  setTimeout(() => {
    counterMapMeeting.value++
  }, 300);
}

onMounted(() => {
  isViz.value = true;
})



function resetAuthors() {
  author.value = ''
}

</script>
