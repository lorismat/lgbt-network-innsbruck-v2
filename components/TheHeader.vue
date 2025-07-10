<template>
  <header>
    <nav class="flex justify-between px-24 py-6 border-b border-gray-700 shadow-md">
      <div>
        <NuxtLink :class="classBase" activeClass="text-gray-900" to="/">Home</NuxtLink>
      </div>
      <ul class="flex gap-12">
        <li><NuxtLink :class="classAlt" to="/visualizations/scope-network">Visualizations</NuxtLink></li>
        <li><NuxtLink :class="classBase" to="/enhancement">Future Directions</NuxtLink></li>
        <li><NuxtLink :class="classBase" :activeClass="classActive" to="/about">About</NuxtLink></li>
        <li><NuxtLink :class="classBase" :activeClass="classActive" to="/contact">Contact</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>

const classBase = ref('text-gray-700 hover:text-gray-500');
const classDiff = ref('text-purple-600 hover:text-gray-500');
const classActive = ref('border-b-2 border-gray-900 text-gray-900');
const classAlt = ref('text-gray-700 hover:text-gray-500');
const isViz = useState('isViz')

watch(() => isViz.value, (newValue, oldValue) => {
  classAlt.value = isViz.value ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-700 hover:text-gray-500'
})

</script>