<template>
  <HeaderViz />
  <Tooltip 
    :description="popupDescription"
  />
  <BaseContent 
    title="Force-Directed Graph of Author Meetings and Material Exchanges"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />

  <div class="py-12">
    <FormKit
      v-model="author"
      type="select"
      label="Select an Author"
      name="author"
      inner-class="ring-0 focus-within:ring-gray-500"
      :options="allAuthors"
    />

    <AuthorCard 
      :authorInfo="authorInfo"
    />
  </div>

  <div id="directed">
  </div>
  
  <div class="py-24">
  </div>

</template>

<script setup>
import * as d3 from 'd3'

const author = ref('')
const authorInfo = ref('')
const allAuthors = useState('allAuthors')

const peopleDataset = useState('peopleDataset')
const directedMeetings = useState('directedMeetings')

const popupDescription = ref('')
const popupVisible = useState('popupVisible', () => false)

watch(() => author.value, (newValue, oldValue) => {

  if ( author.value != '' ) {

    const vals = peopleDataset.value.filter(x =>  x.ID_1 == author.value)[0]
  
    authorInfo.value = {
      name: vals['ID_1'],
      dob: vals['Date of birth'],
      dod: vals['Date of death'], 
      occupation: vals['Occupation'],
      orientation: vals['Sexual orientation']
    }

    // filter the selected author to only match meetings with dedicated one
    let filteredMeetings = directedMeetings.value.filter(e => {
      return e.participants.includes(author.value);
    });

    let nodesArray = []
    filteredMeetings.forEach((e, idx) => {
      for (let i = 0; i<e.participants.length;i++) {
        nodesArray.push({
          "id": e.participants[i],
          "group": e.participants[i] === author.value ? 1 : 2
        })
      }
    })
    nodesArray = [...new Map(nodesArray.map(v => [JSON.stringify([v.id,v.group]), v])).values()]


    let linksArray = [];

    nodesArray.forEach((e, idx) => {
      for (let i=0;i<filteredMeetings.length; i++) {
        for (let j=0; j<filteredMeetings[i].participants.length;j++) {
          if (filteredMeetings[i].participants.includes(e.id)) {
            if (e.id != filteredMeetings[i].participants[j]) {
              if (linksArray.filter(it => it.source === e.id && it.target === filteredMeetings[i].participants[j]).length > 0) {
                linksArray.filter(it => it.source === e.id && it.target === filteredMeetings[i].participants[j])[0].value += 1;
              } else {
                linksArray.push({
                  "source": e.id,
                  "target": filteredMeetings[i].participants[j],
                  "value": 1
                })
              }
            }
          }
        }
      }
    })

    // count to add values
    // alphabetical order + remove source+target

    // sort by alphabetical order
    linksArray.forEach((e, idx) => {
      if (e.source > e.target) {
        const newSource = e.target;
        const newTarget = e.source;
        e.source = newSource;
        e.target = newTarget;
      }
    })

    // remove duplicates
    linksArray = [...new Map(linksArray.map(v => [JSON.stringify([v.source,v.target]), v])).values()]

    const data = {
      "nodes": nodesArray,
      "links": linksArray
    }

    // dynamic height 
    let height;

    if (nodesArray.length < 4) {
      height = 200

    } else if (nodesArray.length < 8) {
      height = 400
    } else {
      height = 700
    }

    const width = 928;
    const linkColor = '#e6e6e6';

    // Defines a color scale.
    const customColors = [
        '#d9d1b8', '#401f13', '#736355'
      ];
    const color = d3.scaleOrdinal(customColors);

    // svg cleaning
    d3.select("#directed").selectAll("*").remove();

    if (linksArray.length > 0) {

      // The force simulation mutates links and nodes, so create a copy
      // so that re-evaluating this cell produces the same result.
      const links = data.links.map(d => ({...d}));
      const nodes = data.nodes.map(d => ({...d}));

      // Create a simulation with several forces.
      const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-2000))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);

      // Create the SVG container.
      const svg = d3.select("#directed")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto;");

      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
          .attr("stroke", linkColor)
          .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
          .attr("class", "paths cursor-pointer")
          .attr("stroke-width", d => Math.sqrt(d.value * 3))
          .on("click", click)
          .on("mouseout", mouseout)
          .on("mouseover", mouseover);

      const node = svg.append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
        .selectAll("g")
        .data(nodes)
        .join("g")

      const circle = node.append("circle")
          .attr("r", 10)
          .attr("fill", d => color(d.group));

      const text = node.append("text")
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'black')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.2)
        .attr('dy', -10)
        
        .text(d => d.id)
        //.attr("fill", d => color(d.group));

      
      node.append("title")
        .text(d => d.id);
      

      // Set the position attributes of links and nodes each time the simulation ticks.
      function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        text
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`)
      }

      function mouseover(event) {
        d3.select(event.target).attr("stroke", "#555")
      }

      function mouseout() {
        d3.selectAll(".paths").attr("stroke", linkColor)
      }

      function click(event, el) {
        popupDescription.value = "WIP"
        popupVisible.value = true
      }

    } else {
      const message = `
        <div>No meetings/publications registered for ${author.value}</div>
      `
      d3.select("#directed").html(message)
    }
  }

})



</script>