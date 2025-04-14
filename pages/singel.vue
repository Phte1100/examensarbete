<template>
    <div v-if="article" class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">{{ article.title }}</h1>
  
      <img
        v-if="article.img_url || article.url_to_image"
        :src="article.img_url || article.url_to_image"
        class="rounded-xl mb-4 w-full object-cover max-h-72"
      />
  
      <p class="text-sm text-gray-500 mb-2">
        {{ article.author || article.byline }} – {{ article.published_at?.substring(0, 20) || article.published_date?.substring(0, 20) }}
      </p>
  
      <p class="text-gray-700 mb-4">{{ article.content || article.abstract || article.description }}</p>
  
      <a :href="article.url" target="_blank" class="text-blue-600 hover:underline">Öppna originalartikel</a>
    </div>
  
    <div v-else class="text-center p-10 text-gray-500">Laddar artikel...</div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { ref, onMounted } from 'vue'
  

  const route = useRoute()
  const article = ref(null)
  
  const fetchArticles = async () => {
    try {
      const [resNewsapi, resNyt] = await Promise.all([
        $fetch('/api/news/list'),
        $fetch('/api/news/list2')
      ])
      const all = [...resNewsapi.data, ...resNyt.data]
  
      // Hitta den artikel som matchar URL-parametern
      article.value = all.find(a => a.url === route.query.url)
      article.value.content = article.value.content?.replace(/\s*\[\+\d+ chars\]/, '')
    } catch (err) {
      console.error('Kunde inte ladda artikeln:', err)
    }
  }
  
  onMounted(fetchArticles)
  </script>
  