<template>
  <HeaderViz />
  <div class="py-12">
    <div id="timeline"></div>
  </div>
</template>

<script setup>
// using timeline standalone build 
// https://visjs.github.io/vis-timeline/examples/timeline/standalone-build.html

const forTimeline = useState('forTimeline')


onMounted(() => {

  console.log(forTimeline.value);
  const container = document.getElementById('timeline');
  const items = new vis.DataSet([
    { id: 1, content: "item 1", start: "2014-04-20" },
    { id: 2, content: "item 2", start: "2014-04-14" },
    { id: 3, content: "item 3", start: "2014-04-18" },
    { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
    { id: 5, content: "item 5", start: "2014-04-25" },
    { id: 6, content: "item 6", start: "2014-04-27", type: "point" }
  ]);
  const options = {};
  const timeline = new vis.Timeline(container, items, options)
})


</script>