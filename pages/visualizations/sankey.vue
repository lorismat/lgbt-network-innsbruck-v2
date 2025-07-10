<template>
  <HeaderViz />
  <SectionSubtitle 
    text="In this section, you can visualize the LGBTQ+ network by author."
  />
  <Tooltip 
    :description="popupDescription"
    :title="popupTitle"
  />
  <BaseContent 
    title="Sankey-Diagram for Author Meetings"
    part1="
    If you select an author from the drop-down menu below, it will generate a diagram of all their meetings with other LGBTQ+ exile writers organized according to location.
    If you click on a particular connection, a pop-up box will give you further information about the meetings that took place between writers in a given location.
    "
  />

  <BaseLoader :displayLoader="displayLoader" padding="py-44" />

  <div v-if="displayLoader != 'block' ">
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
  </div>
    
</template>

<script setup>
import * as d3 from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal, sankeyJustify } from 'd3-sankey'

/* LOADER */
const allAuthors = useState('allAuthors')
const displayLoader = ref('block')
watch(() => allAuthors.value, (newValue, oldValue) => {
  displayLoader.value = 'none';
})
onMounted(() => {
  if (allAuthors.value.length > 0) {
    displayLoader.value = 'none';
  }
})


const author = ref('')
const authorInfo = ref('')

const peopleDataset = useState('peopleDataset')
const sankeyMeetings = useState('sankeyMeetings')

const popupDescription = ref('')
const popupTitle = ref('')
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
        if ( e.participants[i] != author.value ) {
          nodesArray.push({
            "name": e.participants[i],
            "category": 2
          })
        }
        
      }
    })
    nodesArray = [...new Map(nodesArray.map(v => [JSON.stringify([v.name,v.category]), v])).values()]

    let linksArray = []
    console.log("filteredMeetings",filteredMeetings)
    filteredMeetings.forEach((e, idx) => {
      for (let i = 0; i<e.participants.length;i++) {

        if ( e.participants[i] != author.value ) { 

          if (linksArray.filter(it => it.source === e.participants[i] && it.target === e.city).length > 0) {
            linksArray.filter(it => it.source === e.participants[i] && it.target === e.city)[0].value += 1;
            // ?? here ??
            linksArray.filter(it => console.log(it) || it.source === e.participants[i] && it.target === e.city)[0].meetings.push({
              "dateStart": e.dateStart,
              "dateEnd": e.dateEnd,
              "notes": e.notes,
              "source": e.source,
              "page": e.page,
              "participants": e.participants,
              "dob": e.dob,
              "dod": e.dod,
              "sexuality": e.sexuality,
              "job": e.job,
              "nationality": e.nationality
            })
          } else {
            linksArray.push({
              "source": e.participants[i],
              "target": e.city,
              "value": 1,
              "meetings": [{
                "dateStart": e.dateStart,
                "dateEnd": e.dateEnd,
                "notes": e.notes,
                // ?? here ??
                "source": e.source,
                "page": e.page,
                "participants": e.participants,
                "dob": e.dob,
                "dod": e.dod,
                "sexuality": e.sexuality,
                "job": e.job,
                "nationality": e.nationality
              }]
            })
          }
        }
      }
    })
      
    const data = {
      "nodes": nodesArray,
      "links": linksArray
    }

    const linkColor = '#e6e6e6';

    // svg cleaning
    d3.select("#sankey").selectAll("*").remove();

    if (linksArray.length > 0) {

      const width = 928;
      let height = 0;

      if (linksArray.length < 6) {
        height = 200
      } else if (linksArray.length < 12) {
        height = 400
      } else {
        height = 800
      }

      const svg = d3.select("#sankey")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 13px sans-serif;");
      
      const sankey = d3Sankey()
        .nodeId(d => d.name)
        .nodeAlign(sankeyJustify) // d3.sankeyLeft, etc.
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

      let {nodes, links} = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });
        
      // Defines a color scale.
      const customColors = [
        '#736355', // other color
        '#d9d1b8', // color light beige
        '#401f13' // color dark 
        
      ];
      const color = d3.scaleOrdinal(customColors);

      nodes = nodes.sort(d => d.category);
      const rect = svg.append("g")
        .selectAll()
        .data(nodes)
        .join("rect")
          .attr("id", d => `node-id-${d.index}`)
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("height", d => d.y1 - d.y0)
          .attr("width", d => d.x1 - d.x0)
          .attr("opacity", 1)
          .attr("stroke-width", 2)
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0)
          .attr("class", "node-rect")
          .attr("fill", d => color(d.category));

      // Adds a title on the nodes.
      rect.append("title")
          .text(d => `${d.name}\n${d.value}`);

      // Creates the paths that represent the links.
      const link = svg.append("g")
          .attr("fill", "none")
          .attr("stroke-opacity", 0.9)
        .selectAll()
        .data(links)
        .join("g")
          .style("mix-blend-mode", "multiply");

      link.append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("class", "paths cursor-pointer")
        .attr("stroke", linkColor)
        .attr("stroke-width", d => Math.max(3, d.width))
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
          .attr("class", "text-label")
          .attr("id", d => `text-id-${d.index}`)
          .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
          .attr("y", d => (d.y1 + d.y0) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
          .text(d => d.name);

      function mouseover(event, t) {
        d3.select(event.target).attr("stroke", "#555")
        d3.select(`#text-id-${t.source.index}`).attr("font-weight", "bold")
        d3.select(`#text-id-${t.target.index}`).attr("font-weight", "bold")

        d3.selectAll(".node-rect").attr("opacity", 0.2)
        d3.select(`#node-id-${t.source.index}`).attr("opacity", 1).attr("stroke-opacity", 1)
        d3.select(`#node-id-${t.target.index}`).attr("opacity", 1).attr("stroke-opacity", 1)

      }

      function mouseout() {
        d3.selectAll(".paths").attr("stroke", linkColor)
        d3.selectAll(".text-label").attr("font-weight", "regular")
        d3.selectAll(".node-rect").attr("opacity", 1).attr("stroke-opacity", 0)

      }

      function click(event, el) {

        const author = el.source.name
        const city = el.target.name
        const meetings = el.meetings

        let meetingString = "Meeting";
        if (meetings.length>1) {
          meetingString = "Meetings"
        }
        popupTitle.value = `
          ${meetings.length} ${meetingString} with ${author} in ${city}
        `

        popupDescription.value = ''
        for ( let i=0 ; i<meetings.length; i++) {

          let page = meetings[i].page
          if (page.includes('-')) {
            page = 'pp. ' + page
          } else {
            page = 'p. ' + page
          }

          let participants = [];
          let participantString = '<br>';

          for (let j = 0; j<meetings[i].participants.length; j++) {
            participants.push({
              "name": meetings[i].participants[j],
              "dob": meetings[i].dob[j],
              "dod": meetings[i].dod[j],
              "nationality": meetings[i].nationality[j],
              "sexuality": meetings[i].sexuality[j],
              "job": meetings[i].job[j]
            })

            let article = 'a';
            let vowelTest = '^[aieouAIEOU].*';
            if (participants[j].nationality.join('/').split('')[0].match(vowelTest)) {
              article = 'an'
            }

            participantString += `
              ● ${participants[j].name} (${participants[j].dob} — ${participants[j].dod}) was ${article} 
              ${participants[j].nationality.join('/')}, ${participants[j].sexuality}, ${participants[j].job.join(', ')}.
              <br>
            `
          }

          let notes = '';
          // title of books in italic
          if (meetings[i].notes != 'undefined') {
            notes = ": " + meetings[i].notes
            notes = notes.split('_')
            const notesFormatted = []
            for (let i = 0; i<notes.length; i++) {
              notesFormatted.push(notes[i])
              if (i%2==0 && i<notes.length-1) {
                notesFormatted.push('<i>')
              } else if (i%2==1) {
                notesFormatted.push('</i>')
              }
            }
            notes = notesFormatted.join('');
          };

          popupDescription.value += `
            <div class="pb-2 my-2 border-b border-dashed border-gray-500 text-sm">
              <div class="py-2">
                <span class='font-sans font-bold'>${meetings[i].dateStart} — ${meetings[i].dateEnd}: </span>
                <span class=''>${notes}</span>
              </div>
              <div><span class='font-sans font-bold'>Participants: </span>
                ${participantString}
              </div>

              <div>
                <br>
                <span class='font-sans font-bold'>Source: </span>
                ${meetings[i].source}
                (${page})
              </div>
            </div>
          `
        }

        // <span class='italic'>${meetings[i].source.split('_')[0].split('by')[0]}</span> by <span>${meetings[i].source.split('_')[0].split('by')[1]}</span>

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