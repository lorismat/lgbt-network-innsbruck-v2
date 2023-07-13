<template>
  <HeaderViz />
  <BaseContent 
    title="Sankey-Diagram for Author Meetings"
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
  </div>

  <div id="sankey">
  </div>

  <div class="py-12">
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal, sankeyLeft, sankeyJustify } from 'd3-sankey'

const tempDataset = useState('tempDataset')
const peopleDataset = useState('peopleDataset')
const allAuthors = ref([''])

const sankeyMeetings = useState('sankeyMeetings')


onMounted(() => {

  const autName = "Christopher Isherwood";

  allAuthors.value = peopleDataset.value.filter(x => x['Date of birth'] != undefined && x['Date of death'] != undefined).map(x => x.ID_1)
  allAuthors.value.push('')

  console.log('sankey', sankeyMeetings.value)
  console.log('tempDatasetNodes', tempDataset.value.nodes)

  // filter the selected author to only match meetings with dedicated one
  sankeyMeetings.value = sankeyMeetings.value.filter(e => {
    return e.participants.includes(autName);
  });

  let nodesArray = []
  sankeyMeetings.value.forEach((e, idx) => {
    nodesArray.push({
      "name": e.city,
      "category": "city"
    })
    for (let i = 0; i<e.participants.length;i++) {
      nodesArray.push({
        "name": e.participants[i],
        "category": "author"
      })
    }
  })
  nodesArray = [...new Map(nodesArray.map(v => [JSON.stringify([v.name,v.category]), v])).values()]

  let linksArray = []
  sankeyMeetings.value.forEach((e, idx) => {
    for (let i = 0; i<e.participants.length;i++) {
      if (linksArray.filter(it => it.source === e.participants[i] && it.target === e.city).length > 0) {
        linksArray.filter(it => it.source === e.participants[i] && it.target === e.city)[0].value += 1;
      } else {
        linksArray.push({
          "source": e.participants[i],
          "target": e.city,
          "value": 1
        })
      }
    }
  })

  console.log('linksArray', linksArray);

  // nodes like
  // [ { name: "a", category: "aut" }, { name: "b", category: "aut" }, { name: "ny", category: "city" }]
  // create nodes
  
  const data = {
    "nodes": nodesArray,
    "links": linksArray
  }
  

  // create links


  // const data = tempDataset.value;
  
 

  // const data = tempDataset.value;
  const width = 928;
  const height = 600;

  const linkColor = '#e6e6e6';

  const svg = d3.select("#sankey")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    
    const sankey = d3Sankey()
    .nodeId(d => d.name)
    .nodeAlign(sankeyJustify) // d3.sankeyLeft, etc.
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 5], [width - 1, height - 5]]);

    const {nodes, links} = sankey({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });
    
    // Defines a color scale.
    const customColors = [
      '#d9d1b8', '#401f13', '#736355'
    ];
    const color = d3.scaleOrdinal(customColors);

    const rect = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0)
      .selectAll()
      .data(nodes)
      .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.category));

    // Adds a title on the nodes.
    rect.append("title")
        .text(d => `${d.name}\n${d.value}`);

    // Creates the paths that represent the links.
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
      .selectAll()
      .data(links)
      .join("g")
        .style("mix-blend-mode", "multiply");

        link.append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

// Adds labels on the nodes.
svg.append("g")
  .selectAll()
  .data(nodes)
  .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);

})

watch(() => sankeyMeetings.value, (newValue, oldValue) => {
})


</script>