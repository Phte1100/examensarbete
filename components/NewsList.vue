<template>
  <div v-if="articles.length" class="mt-8 space-y-6">
    <div
      v-for="article in articles"
      :key="article.id"
      class="bg-white border border-gray-200 hover:shadow-lg transition-shadow rounded-lg p-5"
    >
      <h2 class="text-xl font-bold text-gray-800 mb-1">{{ article.title }}</h2>
      <p class="text-sm text-gray-500 mb-2">
        {{ article.author || 'Okänd' }} – {{ article.published_at?.substring(0, 10) }}
      </p>
      <p class="text-gray-700 mb-2">{{ article.description }}</p>

      <div class="flex items-center space-x-4">
        <button
          class="text-sm text-red-600 hover:underline"
          @click="toggleLike(article.id)"
        >
          ❤️ Gilla
        </button>
        <a
          :href="article.url"
          target="_blank"
          class="text-blue-600 hover:underline font-medium"
        >
          Läs mer
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

const articles = ref([])
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fetchArticles = async () => {
  try {
    const res = await $fetch('/api/news/list')
    articles.value = res.data
  } catch (err) {
    console.error('Kunde inte hämta artiklar:', err)
  }
}

const toggleLike = async (newsId) => {
  if (!user.value) {
    alert("Du måste vara inloggad för att gilla.")
    return
  }

  try {
    const res = await $fetch('/api/likes/toggle', {
  method: 'POST',
  body: { newsId },
  headers: {
    authorization: `Bearer ${user.value?.access_token}`
  }
})

    console.log(res.liked ? 'Gillad!' : 'Like borttagen!')
  } catch (err) {
    console.error('Fel vid toggling av like:', err)
  }
}


onMounted(fetchArticles)
</script>
