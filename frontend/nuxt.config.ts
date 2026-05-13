// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    optimizeDeps: {
      include: ["socket.io-client", "@vue/devtools-core", "@vue/devtools-kit"]
    }
  },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_APIBASE
    }
  }
})
