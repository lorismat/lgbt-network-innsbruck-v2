<template>
  <div id="base-loader" :style="{ 'display' : displayLoader }" :class="padding">
    <div class="mx-auto loader">
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  displayLoader: {
    type: String
  }, 
  padding: {
    type: String
  }
})

</script>