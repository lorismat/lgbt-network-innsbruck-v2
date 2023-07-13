<template>
  <HeaderViz />
  <BaseContent 
    title="Force-Directed Graph of Author Meetings and Material Exchanges"
    part1="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
    part2="Lorem // Lorem // ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere nisl sit amet accumsan finibus. Suspendisse ullamcorper, turpis a sollicitudin venenatis, turpis lacus aliquam turpis, a feugiat risus ipsum euismod mi."
  />

  <div class="py-12">
    WORK IN PROGRESS -- 
  </div>

  <div id="directed">
  </div>

  <!-- 

    <div class="p-8 bg-gray-100 my-8">
    <FormKit
      v-model="author"
      type="select"
      label="Select an Author"
      name="author"
      :options="allAuthors"
    />
    <div class="py-4 px-2 my-4 bg-gray-200">
      {{ author.name }}
    </div>
    <div class="py-12">
      {{ nodes }}
    </div>
    <div class="py-12">
      {{ edges }}
    </div>
    <div class="py-12">
      {{ another }}
    </div>
  </div>
  -->
  
  <div class="py-12">
  </div>

</template>

<script setup>
import * as d3 from 'd3'


const author = ref({
  "label": "Christopher Isherwood",
  "value": {
    "name": "Christopher Isherwood",
    "id": "recEINIUFNENSS"
  }
})
const allAuthors = ref([''])
const nodes = ref([])
const edges = ref([])
const another = ref([])


const peopleDataset = useState('peopleDataset')
const meetingsDataset = useState('meetingsDataset')

const tempDataset = useState('tempDataset')

const directedMeetings = useState('directedMeetings')


onMounted(() => {
  // const data = tempDataset.value;

  const autName = "Stephen Spender";

  // filter the selected author to only match meetings with dedicated one
  directedMeetings.value = directedMeetings.value.filter(e => {
    return e.participants.includes(autName);
  });

  

  let nodesArray = []
  directedMeetings.value.forEach((e, idx) => {
    for (let i = 0; i<e.participants.length;i++) {
      nodesArray.push({
        "id": e.participants[i],
        "group": e.participants[i] === autName ? 1 : 2
      })
    }
  })
  nodesArray = [...new Map(nodesArray.map(v => [JSON.stringify([v.id,v.group]), v])).values()]


  let linksArray = [];

  nodesArray.forEach((e, idx) => {
    for (let i=0;i<directedMeetings.value.length; i++) {
      for (let j=0; j<directedMeetings.value[i].participants.length;j++) {
        if (directedMeetings.value[i].participants.includes(e.id)) {
          if (e.id != directedMeetings.value[i].participants[j]) {
            if (linksArray.filter(it => it.source === e.id && it.target === directedMeetings.value[i].participants[j]).length > 0) {
              linksArray.filter(it => it.source === e.id && it.target === directedMeetings.value[i].participants[j])[0].value += 1;
            } else {
              linksArray.push({
                "source": e.id,
                "target": directedMeetings.value[i].participants[j],
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

  console.log('data', data);

  const width = 928;
  const height = 600;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
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
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", d => color(d.group));

  
  node.append("title")
      .text(d => d.id);
  

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  //invalidation.then(() => simulation.stop());

    /*
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
      .text(d => console.log(d) || d.name);

      */
})


watch(() => tempDataset.value, (newValue, oldValue) => {
})

/*
onMounted(() => {
  allAuthors.value = peopleDataset.value.map(function(d) {
    return {
      "label": d['ID'],
      "value": {
        "name": d['ID'],
        "id": d['createdPerson']
      }
    }
  })
})
*/


/*
watch(() => author.value, (newValue, oldValue) => {

  meetingsDataset.value.filter(x => x.Participants.includes(author.value.id)).forEach(d => {
    nodes.value.push(d['ID (from Participants)'])
  })
  nodes.value = Array.from(new Set(nodes.value.flat()))

  // list all encounters
  // for every node, list all encounters with other nodes
  // remove duplicates
  // create an array of array

  edges.value = []
  
  nodes.value.forEach((d, idx) => {
    for (let i = 0; i < meetingsDataset.value.length; i++) {
      if (meetingsDataset.value[i]['ID (from Participants)'].includes(author.value.name)) {
        edges.value.push(meetingsDataset.value[i]['ID (from Participants)'])
      }
    }
  })

  another.value = []
})
*/

</script>