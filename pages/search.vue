<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Resultat för "{{ query }}"</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<!-- Nyheter -->
<div>
  <h2 class="text-center font-semibold mb-2">#Nyheter</h2>
  <div v-if="results.news.length">
    <div
      v-for="(item, index) in results.news"
      :key="index"
      class="p-2 border-b"
    >
      <p class="text-sm text-gray-500">
        {{ item.published_at?.slice(0, 10) }} - {{ item.source || 'Okänd' }}
      </p>
      <NuxtLink
        :to="`/singel?url=${encodeURIComponent(item.url)}`"
        class="font-medium text-gray-800 hover:underline block"
      >
        {{ item.title }}
      </NuxtLink>
    </div>
  </div>
  <p v-else class="text-sm text-gray-400 text-center">Inga nyheter</p>
</div>

  
        <!-- Stack Overflow -->
        <div>
          <h2 class="text-center font-semibold mb-2">#Stack Overflow</h2>
          <div v-if="results.stackoverflow.length">
            <div
              v-for="(item, index) in results.stackoverflow"
              :key="index"
              class="p-2 border-b"
            >
              <a :href="item.link" target="_blank" class="text-blue-600 hover:underline">{{ item.title }}</a>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 text-center">Inga träffar</p>
        </div>
  
        <!-- Hacker News -->
        <div>
          <h2 class="text-center font-semibold mb-2">#Hacker News</h2>
          <div v-if="results.hackernews.length">
            <div
              v-for="(item, index) in results.hackernews"
              :key="index"
              class="p-2 border-b"
            >
              <a :href="item.link" target="_blank" class="text-orange-600 hover:underline">{{ item.title }}</a>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 text-center">Inga träffar</p>
        </div>
  
        <!-- Dev.to -->
        <div>
          <h2 class="text-center font-semibold mb-2">#Dev.to</h2>
          <div v-if="results.devto.length">
            <div
              v-for="(item, index) in results.devto"
              :key="index"
              class="p-2 border-b"
            >
              <a :href="item.url" target="_blank" class="text-indigo-600 hover:underline">{{ item.title }}</a>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 text-center">Inga träffar</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, watch } from 'vue'

const query = useState('searchQuery') // global
const results = ref({
  news: [],
  stackoverflow: [],
  hackernews: [],
  devto: []
})

const fetchSearch = async () => {
  if (!query.value.trim()) return

  const [newsRes, threadsRes] = await Promise.all([
    $fetch('/api/news/search', {
      method: 'POST',
      body: { query: query.value }
    }),
    $fetch('/api/search/fetch', {
      method: 'POST',
      body: { query: query.value }
    })
  ])

  results.value = {
    news: newsRes?.data || [],
    stackoverflow: threadsRes?.stackoverflow || [],
    hackernews: threadsRes?.hackernews || [],
    devto: threadsRes?.devto || []
  }
}

// Kör direkt vid mount
onMounted(fetchSearch)

// Kör varje gång söksträngen ändras (om du redan är på sidan)
watch(query, () => {
  fetchSearch()
})
</script>

  