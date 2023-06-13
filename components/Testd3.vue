<template>
  <div>
    temp d3
  </div>
</template>

<script setup>
import * as d3 from 'd3'

onMounted(() => {
  d3.json('temp.json').then(data => {
    console.log(data)
  })
})

</script>