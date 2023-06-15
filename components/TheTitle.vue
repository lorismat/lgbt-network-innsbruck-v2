<template>
  <div class="py-12 text-center text-4xl">
    {{ title }}
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

</script>

<style lang="scss" scoped>

</style>