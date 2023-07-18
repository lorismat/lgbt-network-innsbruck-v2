<template>
  <div class="text-left mx-auto max-w-3xl text-xl pt-8 pb-2 text-gray-700 font-bold">
    {{ subtitle }}
  </div>
</template>

<script setup>
const props = defineProps({
  subtitle: {
    type: String,
    required: true
  }
})

</script>