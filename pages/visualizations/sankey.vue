<template>
  <HeaderViz />
  <Tooltip 
    :description="popupDescription"
  />
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

    <AuthorCard 
      :authorInfo="authorInfo"
    />
  </div>

  <div id="sankey">
  </div>

  <div class="py-24">
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey'

const author = ref('')
const authorInfo = ref('')
const allAuthors = useState('allAuthors')

const peopleDataset = useState('peopleDataset')
const sankeyMeetings = useState('sankeyMeetings')

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
    let filteredMeetings = sankeyMeetings.value.filter(e => {
      return e.participants.includes(author.value);
    });

    let nodesArray = []
    filteredMeetings.forEach((e, idx) => {
      nodesArray.push({
        "name": e.city,
        "category": "city"
      })
      for (let i = 0; i<e.participants.length;i++) {
        nodesArray.push({
          "name": e.participants[i],
          "category": e.participants[i] === author.value ? 1 : 2
        })
      }
    })
    nodesArray = [...new Map(nodesArray.map(v => [JSON.stringify([v.name,v.category]), v])).values()]

    let linksArray = []
    filteredMeetings.forEach((e, idx) => {
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
      
    const data = {
      "nodes": nodesArray,
      "links": linksArray
    }

    const width = 928;
    const height = 600;

    const linkColor = '#e6e6e6';

    // svg cleaning
    d3.select("#sankey").selectAll("*").remove();

    if (linksArray.length > 0) {

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
        .attr("class", "paths cursor-pointer")
        .attr("stroke", linkColor)
        .attr("stroke-width", d => Math.max(1, d.width))
        .on("click", click)
        .on("mouseout", mouseout)
        .on("mouseover", mouseover);

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

      function mouseover(event) {
        d3.select(event.target).attr("stroke", "#555")
      }

      function mouseout() {
        d3.selectAll(".paths").attr("stroke", linkColor)
      }

      function click(event, el) {
        popupDescription.value = "hey"
        popupVisible.value = true
      }

    } else {
      const message = `
        <div>No meetings registered for ${author.value}</div>
      `
      d3.select("#sankey").html(message)
    }
  }
})


</script>