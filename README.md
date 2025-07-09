# LGBT Network // v2.0

[Link](https://lgbt-network-innsbruck-v2.vercel.app/)

## To-do

- ~~make sure about the workflow for dev-branch/share new link~~
- get into `Data.vue` file
- try out new data
- set up the road map for further directions
- work on the first chart

## Stack

- d3
- formkit
- tailwind
- leaflet (and [themes](https://leaflet-extras.github.io/leaflet-providers/preview/)) and [clusters lib - marker clusters](https://github.com/Leaflet/Leaflet.markercluster)
- a timeline lib ([vis-timeline](https://github.com/visjs/vis-timeline) and [its standalone build](https://visjs.github.io/vis-timeline/examples/timeline/standalone-build.html))
- airtable sync with secured scope, limited to 100 calls []()
- arquero 
- axios

## Local setup

- `Nuxt App`
- tailwind
- formkit

### Local Instructions

`npm run dev` 

#### Process

- `git checkout -b dev-branch`
- `git add . && git -m "blabla"`
- `git push -u origin dev-branch`
- `git checkout dev-branch`
- `gitb`

### VS

`Version 1.24.0` / `macos 10.15.7`

## Todo

## Airtable

- `app.config.ts`

## What I need

## Warning

- API calls limit to 100 are bypassed by recursive functions (up to 10)

## Prod

- static app

## Report

- Errors on the Participant column
```
Material Exchanges  
1565 no agent > I assume Thornton Wilder, The Selected Letters of Thornton Wilder
Documents
401 no author > I assume Sylvia Scarlett, The Early Life and Adventures of Sylvia Scarlett
440 no author > I assume Gertrude Stein, Water Pipe
473 no author > I assume Osbert Sitwell, Laughter in the next room
```
