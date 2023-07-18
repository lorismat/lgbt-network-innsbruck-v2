<template>
  <div>
    <TheTitle title="Enhancement"/>
    <TheSubTitle subtitle="Introduction"/>
    <div class="mx-auto text-gray-800 max-w-3xl text-justify">
      The current website only explores some elements of the networks of Anglophone LGBTQ writers in exile. In a newer version, we would like to go further and present new data, new visualisations and new features in a different way. Here we present what could be an improved version of the website through a few mock-ups and ideas. It is simply a glimpse of what networks of Anglophone LGBTQ writers in exile might look like in the near future.
      To showcase the potential work, we've divided the presentation into four parts. 
      <br>
      <div class="py-6 px-12 font-bold">
        I. Revamping the website <br>
        II. Introducing new functionalities <br>
        III. Presenting new visualizations <br>
      </div>
      <div>
        In the first part, <span class="italic">Revamping the website</span>, we present how the new website could present the visualisations in a different way. While the current version gives a good overview of the data by location and author, it lacks harmony and organisation. The idea would be to organise it better while giving the overall scope of the network in the current study. <br>
        In the second part, <span class="italic">Introducing new functionalities</span>, we will show how the new functionalities can be used to display new data and make the study even more relevant. <br>
        In the third part, <span class="italic">Presenting the new visualizations</span>, we will draw attention to the new visuals designed to explore the database in depth. <br>
      </div>
      
    </div>
    <TheSubTitle subtitle="I. Revamping the website"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Here, we are showing a potential version of the whole website via the landing page and the three different blocks: 
      Scope of the study, by author and by locations. In the other sections, we will detail the extra sections, visualizations, and functionalities.
    </div>

    <BaseSlide 
      url="slide_1" 
      title="Landing Page"
      legend="The landing page now lets you choose between three sections: Scope, by Author, by Locations"
    />

    <BaseSlide 
      url="slide_2" 
      title="Block 1: Scope of the study"
      legend="In the scope of the study, you have different views of the whole database and connections.
      The idea is to give an overview of what the data is about, and how the authors and represented."
    />

    <BaseSlide 
      url="slide_3" 
      title="Block 2: Visualization by Author"
      legend="In this block, you can view different visualizations by author: their bio, their timeline and their meetings/publications."
    />

    <BaseSlide 
      url="slide_4" 
      title="Block 3: Visualization by Locations"
      legend="In this block, you have a geographical view of the data, including Birth countries, Exile countries, Meetings and Correspondence."
    />

    <TheSubTitle subtitle="II. Introducing new functionalities"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      In this section, we 
      are presenting new functionalities within some visuals to better explore and explain the data. 
      These new functionalities requires different aggregations and interactivities.
      
      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          1. Various toggles accross the application
        </div>
        Within some key visuals, we introudce toggles to display different data within the same visualization. For example,
        a choropleth map by "Country of Birth" or "Country of Exile"
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="func_1"
          class="mx-auto max-w-sm"
          small="true"
          />
        <BaseSlide 
          url="func_1_bis"
          class="mx-auto max-w-sm"
          small="true" 
        />
      </div>



      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          2. Timeline Filtering on maps
        </div>
        For the "Map of Correspondence" and the "Map of Meetings", we will add a timeline filter to select specific range
         of data in time, and see the evolution
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="func_2"
          class="mx-auto max-w-xl"
          small="true"
          />
      </div>

      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          3. Author Biopic
        </div>
        In the "by Author" section, we will enrich the data with extra informations about the author such as a short biography, a picture and its main publications. 
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="func_3"
          class="mx-auto max-w-xl"
          small="true"
          />
      </div>
      

    </div>

    

    <TheSubTitle subtitle="III. Presenting the new visualizations"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Before presenting each new visualization, it is important to remember that each new visualization requires a new way to 
      organize and aggregate the data. The work is both has to be done both in the way the data is organized and then visualized.
    
      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          1. Key Metrics
        </div>
        Showing a first set of key metrics to present the scope of the data. 
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="new_1"
          class="mx-auto max-w-2xl"
          small="true"
          />
      </div>



      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          2. A Bilevel Edge Bundling Network
        </div>
        This visualization allow us to get at a glance all the connection in the dataset (by meetings, or material exchange). Mousing over the authors 
        will give extra insight. This visualization is good to see the links and their density between the different nodes (the authors).
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="new_2"
          class="mx-auto max-w-xl"
          small="true"
          />
      </div>

      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          3. A Circle-Packing Visual
        </div>
        This visualization is good to see for a specific metric (eg: number of publication, number of meetings, quantity of material exchange) the 
        space it takes in comparison with others. This way we quickly know who is represented in the database and how. 
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="new_3"
          class="mx-auto max-w-xl"
          small="true"
          />
      </div>
    
    
    </div>

  </div>
</template>

<script setup>

const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

</script>