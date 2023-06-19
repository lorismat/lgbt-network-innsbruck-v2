<template>
  <div>
    <div
      @click="popupTimelineVisible = false"
      :style="popupTimelineVisible ? { 'display': 'block' } : { 'display': 'none' }"
      class="bg-gray-800 fixed opacity-40 z-10 p-12 top-0 left-0 w-screen h-screen"
    >
    </div>
    <div 
      :style="popupTimelineVisible ? { 'visibility': 'initial' } : { 'visibility': 'hidden' }"
      class="shadow-md drop-shadow-xl align-center bg-white rounded-md border-2 border-gray-800 max-w-xl fixed w-full mx-auto div-center-screen"
    >
      <div class="px-4 py-2 flex justify-end cursor-pointer">

        <svg @click="popupTimelineVisible = false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </div>
      <div class="p-4 pb-8">
        {{ description }}
      </div>
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