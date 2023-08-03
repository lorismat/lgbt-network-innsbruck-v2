<template>
  <div>
    <TheTitle title="Contact"/>

    <div class="mx-auto text-gray-800 max-w-3xl">
      Benjamin Robbins
      <br>Institut für Amerikastudien | Universität Innsbruck
      <br>Address: Universität Innsbruck | Innrain 52 | 6020 Innsbruck
      <br>All Content © Benjamin Robbins 2023
    </div>

    <div class="py-20 my-64"></div>
  </div>
</template>

<script setup>

const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

</script>