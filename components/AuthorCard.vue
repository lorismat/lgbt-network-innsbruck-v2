<template>
  <!-- Card displayed after author is selected, for Sankey, Timeline, Force-directed -->
  <div v-if="authorInfo != ''" class="p-2 max-w-lg border border-l-4 border-gray-800">
    <div class="inline-flex items-baseline justify-between w-full">
      <div class="text-xl pr-2">
        {{ authorInfo.name }}
      </div>
      <div class="text-gray-500">
        {{ authorInfo.dob }} ― {{ authorInfo.dod }}
      </div>
    </div>
    <div class="inline-flex items-baseline justify-between w-full">
      <div>
        {{ authorInfo.occupation.join(', ') }}
      </div>
      <div class="text-sm font-bold">
        {{ authorInfo.orientation }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  authorInfo: [String, Object],
})


</script>
