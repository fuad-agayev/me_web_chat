// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
 css: ['./app/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ["socket.io-client", "@vue/devtools-core", "@vue/devtools-kit", "leaflet"]
    },
    plugins: [
      tailwindcss(),
    ]
  },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_APIBASE
    }
  }
})
