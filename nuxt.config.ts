// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'Learnit',
      htmlAttrs: {
        lang: 'sv',
      }
    }
  },
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm', 
    }
  },
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss', '@nuxt/ui'],
  css: [
    '@/assets/css/main.scss',
    '@/assets/css/form.scss'
  ],

  runtimeConfig: {
    NEWS_API_KEY: process.env.NEWS_API_KEY,

    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})