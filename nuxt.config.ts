// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm', // dit magic linken går
    }
  },
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  css: [
    '@/assets/css/main.scss',
    '@/assets/css/form.scss'
  ],

  runtimeConfig: {
    // Dessa är privata och tillgängliga endast på servern
    NEWS_API_KEY: process.env.NEWS_API_KEY,

    public: {
      // Dessa är publika och kan användas på både klient & server
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})