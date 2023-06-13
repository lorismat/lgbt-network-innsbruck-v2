<template>
  <div></div>
</template>

<script setup>
import axios from 'axios'

const stateApiToken = useState('stateApiToken', () => 'patwOhRZOSTKbJUxV.dd847338741d978ed40f01985c33fd7b84842c5236fdcee23c99e458f1f69bcf') // Scope for read-only on Writers Loris Version
const stateAirTableApp = useState('stateAirTableApp', () => 'apprDGAlLVdAvLq9C') // Writers Loris Version is apprDGAlLVdAvLq9C
const stateAirTableId = 'tbl1fMrWi7oRHQYB9' // Locations

const offset = ref('')
const locations = useState('locations', () => []);

// beware only shows one hundred entries
// https://stackoverflow.com/questions/55094884/how-to-fetch-all-records-more-than-100-from-the-airtable-using-axios
// https://airtable.com/developers/web/api/list-records
onMounted(() => {

  function iterCalls(counter) {
    if (offset.value != undefined) {
      axios.get(`https://api.airtable.com/v0/${stateAirTableApp.value}/${stateAirTableId}`,
        { 
          headers: { Authorization: "Bearer " + stateApiToken.value },
          params: { offset: offset.value }
        }
      ).then((res) => {
        locations.value = locations.value.concat(res.data.records);
        offset.value = res.data.offset
        iterCalls(counter-1)
      })
    } else {
      offset.value = undefined;
    }
  }

  iterCalls(10)
    
})

</script>