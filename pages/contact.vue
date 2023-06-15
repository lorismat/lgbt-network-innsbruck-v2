<template>
  <div>
    <TheTitle title="Contact"/>
    <div class="bg-gray-100 mb-8 p-24"></div>

    <TheSubTitle subtitle="Project Leader Biography"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi. Aliquam tristique mauris in magna commodo venenatis. Sed ac eros nulla. Mauris dui risus, accumsan eu lacinia a, malesuada id justo. Proin lacinia gravida varius. Integer sed velit commodo, suscipit velit a, laoreet tortor. Phasellus molestie, lacus ut convallis dignissim, mi metus gravida ante, eu porttitor felis purus placerat sapien. Cras vel felis at quam laoreet aliquet ac sed mauris. Cras posuere eget nisi sit amet consectetur. Sed aliquet pellentesque ante. Nullam ut hendrerit purus, ac finibus elit. Proin in orci ac tellus scelerisque commodo id ac eros. Nulla sit amet lacus ut velit bibendum facilisis vitae nec neque.
    </div>
  </div>
</template>

<script setup>

const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

</script>