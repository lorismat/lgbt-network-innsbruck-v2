# LGBT Network // Innsbruck

[Link](https://lgbt-network-innsbruck.vercel.app/)

## To-do

- make sure about the workflow for dev-branch
- read code again
- clean code
- try out new data
- set up the road map

## Stack

- d3
- formkit
- tailwind
- leaflet (and [themes](https://leaflet-extras.github.io/leaflet-providers/preview/)) and [clusters lib - marker clusters](https://github.com/Leaflet/Leaflet.markercluster)
- a timeline lib ([vis-timeline](https://github.com/visjs/vis-timeline) and [its standalone build](https://visjs.github.io/vis-timeline/examples/timeline/standalone-build.html))
- airtable sync with secured scope, limited to 100 calls []()
- arquero 

## Local setup

- `Nuxt App`
- tailwind
- formkit
```
"dependencies": {
  "@formkit/icons": "^0.17.2",
  "@formkit/themes": "^0.17.2",
  "arquero": "^5.2.0",
  "axios": "^1.4.0",
  "d3": "^7.8.5",
  "d3-sankey": "^0.12.3",
  "vis-timeline": "^7.7.2"
},
"devDependencies": {
  "@formkit/nuxt": "^0.17.2",
  "@nuxt/devtools": "latest",
  "@nuxtjs/tailwindcss": "^6.7.0",
  "@types/node": "^18",
  "nuxt": "^3.5.2"
```

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

## What I need

## Warning

- API calls limit to 100 are bypassed by recursive functions (up to 10)

## Prod

- static app
