<template>
  <div>
    <TheTitle title="Future Directions"/>
    <TheSubTitle subtitle="Introduction"/>
    <div class="mx-auto text-gray-800 max-w-3xl text-justify">
      The current website explores many aspects of networks of Anglophone LGBTQ+ writers in exile. In future developments to the website, we would like to present new data, additional visualizations, and new features. Below we would like to showcase potential future directions for the website through mock-ups and short descriptions of our ideas. Here we aim to provide a glimpse of how the website could look in the near future. To introduce this potential work, we've divided this section into three parts: 
      <br>
      <div class="py-6 px-12 font-bold">
        I. Reorganizing the website <br>
        II. Introducing new functionalities <br>
        III. Presenting new visualizations <br>
      </div>
      <div>
        In the first part, we show how a new version of the website could organize the visualizations in a different way. While the current version gives a great overview of the data organized according to the movements and creative exchanges of exile writers, the visualizations could be integrated still further and made searchable in additional ways. The idea would be to organize the visualizations in ways that foster deeper engagement with the data, while maintaining the overall scope of the current website.
        <br><br>
        In the second part, we show how new functionalities could be used to display and communicate additional aspects of the data.
        <br><br>
        In the third part, we show how new visualizations could be designed to explore the database in greater depth.
      </div>
      
    </div>
    <TheSubTitle subtitle="I. Reorganizing the website"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Below you can see a potential new version of the whole website as it would be organized on the landing page and in three different blocks: “Scope of the study,” “By author,” and “By location.” 
    </div>

    <BaseSlide 
      url="slide_1_bis" 
      title="Landing Page"
      legend="The landing page now lets you choose between three sections."
    />

    <BaseSlide 
      url="slide_2" 
      title="Block 1: Scope of the Network"
      legend="In this overview of the scope of the network, you have different views of the whole database and connections between authors. The idea is to give an overview of the contents of the data and how the authors will be represented."
    />

    <BaseSlide 
      url="slide_3" 
      title="Block 2: Visualizations by Author"
      legend="In this block, you can view different visualizations by author, including their biographies, their timelines, and their meetings and publications."
    />

    <BaseSlide 
      url="slide_4" 
      title="Block 3: Visualizations by Location"
      legend="In this block, you have a spatial overview of the data, including places of birth, places of exile, meetings, and correspondence."
    />

    <TheSubTitle subtitle="II. Introducing new functionalities"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      In this section, we present some new functionalities within the existing visualizations that could support further exploration of the data. These new functionalities would involve aggregating and making the data interactive in different ways.
      
      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          1. Different toggles across the application
        </div>
        We could incorporate toggles to display different aspects of the data within existing visualizations. For example, a choropleth map could show the relative densities of “Places of birth” or “Places of exile” for all the authors in the database or the graphs could be organized according to sub-categories in the data (such as types of meeting). 
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="func_new"
          class="mx-auto max-w-sm"
          small="true"
          />
        <BaseSlide 
          url="func_new_bis"
          class="mx-auto max-w-sm"
          small="true" 
        />
      </div>



      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          2. Timeline filter on maps
        </div>
        For the “Map of Correspondence” and the “Map of Meetings,” we will add a timeline filter to select specific date ranges to see the evolution of the network. 
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
          3. Author biographies
        </div>
        In the "By Author" section, we will enrich the data by providing extra information about the authors presented in the data, such as a short biography, an image of the author, and a list of their main publications.
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="func_3"
          class="mx-auto max-w-xl"
          small="true"
          />
      </div>
      

    </div>

    

    <TheSubTitle subtitle="III. Presenting new visualizations"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Additional visualizations will require organizing and aggregating the data in new ways.

    
      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          1. Key Metrics
        </div>
        An initial set of key metrics will present the general scope of the data.
      </div>

      <div class="mx-auto text-center">
        <BaseSlide 
          url="key_metrics"
          class="mx-auto max-w-2xl"
          small="true"
          />
      </div>



      <div class="py-6">
        <div class="py-2 px-6 font-bold">
          2. A bilevel edge-bundling network visualization
        </div>
        This visualization allows us to view all the connections in the dataset (organized by meetings or material exchanges). By moving the mouse over connections between authors, users will gain further insight into the network. This visualization will display the density of connections between different authors (or nodes).
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
          3. A circle-packing visual
        </div>
        This visualization clearly communicates a specific metric (such as the total number of publications, meetings, or material exchanges) and the selected author’s prominence within the network in comparison with other authors. This tool quickly tells users who is represented in the database and gives an overview of the different data categories.
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