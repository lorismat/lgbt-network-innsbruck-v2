<template>
  <!-- Card displayed in the Home page, clickable links -->
  <a class="p-4 bg-transparent border-2 border-gray-600 rounded-sm shadow-md h-full flex flex-col mx-auto" :href="url">
    <img class="" :src="image" alt="" />
    <div class="pt-4 pb-2">
      <div class=" text-gray-800 text-xl text-center">{{ title }}</div>
      <div class=" text-gray-800 text-sm text-center">{{ description }}</div>
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
