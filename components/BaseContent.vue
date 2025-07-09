<template>
  <!-- Description content below each viz -->
  <div>
    <div class="text-left text-xl pt-8 pb-2 text-gray-700">
      {{ title }}
    </div>
    <div class="max-w-3xl">
      {{ part1 }}
      <div v-if="part2 != undefined" >
        <span @click="  moreInfo = true" :style="moreInfo ? { 'display': 'none' } : { 'display': 'initial' }" class="text-gray-600 cursor-pointer underline decoration-dashed underline-offset-4">More info</span>
        <span :style="!moreInfo ? { 'display': 'none' } : { 'display': 'initial' }">
        {{ part2 }}
        <span @click="  moreInfo = false" class="text-gray-600 cursor-pointer underline decoration-dashed underline-offset-4">Less info</span>
        </span>
      </div>
      
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  part1: {
    type: String,
    required: true
  },
  part2: {
    type: String,
    required: false
  }
})

const moreInfo = ref(false);


</script>

<style lang="scss" scoped>

</style>