<template>
    <div class="p-6">
      <form @submit.prevent="search" class="space-y-4">
        <input
          v-model="query"
          type="text"
          placeholder="Sök på t.ex. Nuxt"
          class="w-full border border-gray-300 rounded p-2"
        />
        <button class="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
          Sök
        </button>
      </form>
  
      <div v-if="results.stackoverflow?.length" class="mt-6">
        <h2 class="text-lg font-bold">Stack Overflow</h2>
        <div v-for="(item, index) in results.stackoverflow" :key="'so-' + index" class="mt-2">
          <a :href="item.link" target="_blank" class="text-blue-600 hover:underline">{{ item.title }}</a>
        </div>
      </div>
  
      <div v-if="results.hackernews?.length" class="mt-6">
        <h2 class="text-lg font-bold">Hacker News</h2>
        <div v-for="(item, index) in results.hackernews" :key="'hn-' + index" class="mt-2">
          <a :href="item.link" target="_blank" class="text-orange-600 hover:underline">{{ item.title }}</a>
        </div>
      </div>
  
      <div v-if="results.devto?.length" class="mt-6">
        <h2 class="text-lg font-bold">Dev.to</h2>
        <div v-for="(item, index) in results.devto" :key="'devto-' + index" class="mt-2">
          <a :href="item.url" target="_blank" class="text-indigo-600 hover:underline">{{ item.title }}</a>
        </div>
      </div>
  
      <p
        v-if="searched && !results.stackoverflow?.length && !results.hackernews?.length && !results.devto?.length"
        class="mt-4 text-red-600"
      >
        Inga resultat hittades.
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const query = ref('')
  const results = ref({ stackoverflow: [], hackernews: [], devto: [] })
  const searched = ref(false)
  
  const search = async () => {
    searched.value = true
    const res = await $fetch('/api/search/fetch', {
      method: 'POST',
      body: { query: query.value }
    })
    if (res.success) {
      results.value = res
    } else {
      alert('Sökningen misslyckades.')
    }
  }
  </script>