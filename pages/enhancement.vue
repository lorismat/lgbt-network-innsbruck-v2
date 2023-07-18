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
        II. Presenting the new sections & visualizations <br>
        III. Introducing new data & functionalities <br>
        IV. Extra requirements <br>
      </div>
      <div>

        In the first part, <span class="italic">Revamping the website</span>, we present how the new website could present the visualisations in a different way. While the current version gives a good overview of the data by location and author, it lacks harmony and organisation. The idea would be to organise it better while giving the overall scope of the network in the current study. <br>
        In the second part, <span class="italic">Presenting the new sections & visualizations</span>, we will draw attention to the new visuals designed to explore the database in depth. <br>
        In the third part, <span class="italic">Introducing new data & functionalities</span>, we will show how the new functionalities can be used to display new data to make the study even more relevant. <br>
        In the final part, <span class="italic">Extra requirements</span>, we are listing some key requirements to push the new website further. 
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


    <TheSubTitle subtitle="II. Presenting the new sections & visualizations"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Before presenting each new visualization, it is important to remember that each new visualization requires a new way to 
      organize and aggregate the data. The work is both has to be done both in the way the data is organized and then visualized.
    </div>

    <BaseSlide 
      url="slide_5" 
    />

    <TheSubTitle subtitle="III. Introducing new data & functionalities"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      In the two previous sections, we introduced a new way to organize the website along with new visuals. In this section, we 
      are presenting new functionalities within some visuals to better explore and explain the data. 
      These new functionalities requires different aggregations and interactivities.
    </div>

    <BaseSlide 
      url="slide_5" 
    />

    <TheSubTitle subtitle="IV. Extra requirements"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Finally, working on the new website will imply some extra requirements in terms of tools and maintenance. Here, 
      we are describing new tasks implied by the revamping of the website.  
    </div>

    <BaseSlide 
      url="slide_5" 
    />

  </div>
</template>

<script setup>

const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

</script>