// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@formkit/nuxt"],
  css: [
    '@/assets/css/main.css',
  ]
})