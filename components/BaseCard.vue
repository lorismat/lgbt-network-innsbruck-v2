<template>
  <a class="p-4 bg-gray-100 shadow-sm h-full flex justify-between flex-col" :href="url">
    <img :src="image" alt="" />
    <div>
      <div class="text-purple-800 text-xl text-center">{{ title }}</div>
      <div class="text-blue-800 text-sm text-center">{{ description }}</div>
    </div>
  </a>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
})

</script>
