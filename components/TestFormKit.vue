<template>
  <div>
    <FormKit
      type="select"
      name="state"
      label="State"
      :options="{
        ca: 'California',
        ny: 'New York',
        va: 'Virginia'
      }"
      v-model="state"
    />

    {{ state }}
  </div>
</template>

<script setup>
const state = ref('ca')

</script>