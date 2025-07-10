<template>
  <!-- Card displayed in the Home page, clickable links -->
  <a class="bg-transparent border border-gray-600 h-full flex flex-col mx-auto" :href="url">
    <div class="p-2 py-4 border-b border-gray-600">
      <div class="text-gray-800 text-md text-center">{{ title }}</div>
    </div>
    <img class="px-1 py-4" :src="image" alt="" />
    <div class="p-2">
      <div class="text-gray-800 text-sm text-center">{{ description }}</div>
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

<style scoped>

.spec-w {
  width: 330px;
  max-width: 330px;
}

</style>
