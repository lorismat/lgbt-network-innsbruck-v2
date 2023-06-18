<template>
  <div 
    :style="popupTimelineVisible ? { 'visibility': 'initial' } : { 'visibility': 'hidden' }"
    class="bg-blue-800 align-center text-white max-w-xl fixed w-full mx-auto div-center-screen"
  >
    <div class="p-4">
      {{ description }}
    </div>
    <div class="text-center p-2 cursor-pointer border-2 border-white rounded-md mx-auto my-2 w-fit" @click="close($event)">
      CLOSE
    </div>
    
  </div>
</template>

<script setup>
const props = defineProps({
  description: String,
  id: String,
})

const popupTimelineVisible = useState('popupTimelineVisible')

function close(e) {
  popupTimelineVisible.value = false;
}

watch(() => popupTimelineVisible.value, (newValue, oldValue) => {
  
})

</script>

<style scoped>
.div-center-screen {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

</style>