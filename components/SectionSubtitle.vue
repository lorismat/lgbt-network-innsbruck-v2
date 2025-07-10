<template>
  <div class="p-2 py-16 text-gray-500">
    <div class="italic text-center">{{ text }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  text: {
    type: String,
    required: true
  }
})

</script>

<style scoped>

</style>
