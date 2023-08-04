<template>
  <div :class="small ? 'my-1' : 'my-12'">
    <div class="text-left font-sans">
      {{ title }}
    </div>
    <img class="" :src="`/images/slides/${props.url}.png`" alt="">
    <div class="text-center text-sm italic text-gray-600">
      {{ legend }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  url: {
    type: String
  },
  legend: {
    type: String
  },
  title: {
    type: String
  }, 
  small: {
    type: Boolean,
    default: false
  }
})

</script>