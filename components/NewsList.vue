<template>
    <div v-if="articles.length" class="mt-8 space-y-6">
      <div
        v-for="article in articles"
        :key="article.id"
        class="bg-white shadow p-4 rounded-lg max-w-xl w-full"
      >
        <h2 class="text-xl font-semibold text-gray-800">{{ article.title }}</h2>
        <p class="text-sm text-gray-600">
          {{ article.author }} – {{ article.published_at?.substring(0, 10) }}
        </p>
        <p class="mt-2 text-gray-700">{{ article.description }}</p>
        <a
          :href="article.url"
          target="_blank"
          class="text-blue-500 hover:underline mt-2 inline-block"
        >Läs mer</a>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  
  const articles = ref([])
  
  const fetchArticles = async () => {
    try {
      const res = await $fetch('/api/news/list')
      articles.value = res.data
    } catch (err) {
      console.error('Kunde inte hämta artiklar:', err)
    }
  }
  
  onMounted(fetchArticles)
  </script>
  