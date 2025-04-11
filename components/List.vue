<template>
    <div v-if="articles.length" class="mt-8 space-y-6">
      <div
        v-for="(article, index) in sortedArticles"
        :key="index"
        class="border border-gray-200 rounded-3xl p-5 transition-shadow hover:scale-[1.02] hover:shadow-[0_6px_18px_-2px_#808080]"
      >
        <div v-if="article.img_url || article.url_to_image" class="mb-4">
          <img
            :src="article.img_url || article.url_to_image"
            alt="Bild"
            class="rounded-xl w-full object-cover max-h-60"
          />
        </div>
  
        <span class="text-xs bg-gray-800 text-white px-2 py-1 rounded-full mb-2 inline-block">
          {{ article.source_name || article.source || 'New York Times' }}
        </span>
  
        <h2 class="text-xl font-bold text-gray-800 mb-1">{{ article.title }}</h2>
        <p class="text-sm text-gray-500 mb-2">
          {{ article.author || article.byline }} – {{ article.published_at?.substring(0, 20) || article.published_date?.substring(0, 20) }}
        </p>
        <p class="text-gray-700 mb-2">{{ article.description || article.abstract }}</p>
  
        <div class="flex items-center space-x-4">
            <button
  v-if="user"
  class="text-sm text-red-600 hover:underline"
  @click="toggleLike(article.id)"
>
  {{ article.userHasLiked ? "💔 Ta bort gilla" : "❤️ Gilla" }} {{ article.likes }}
</button>

  
          <button
            class="text-sm text-indigo-600 hover:underline"
            @click="openModal(article)"
          >
            Läs mer
          </button>
        </div>
      </div>
  
      <USeparator class="my-8" />
  
      <!-- Modal -->
      <UModal v-model="showModal" class="max-w-2xl">
        <template #header>
          <h3 class="text-lg font-semibold">{{ selectedArticle?.title }}</h3>
        </template>
  
        <div v-if="selectedArticle">
          <img
            v-if="selectedArticle.img_url || selectedArticle.url_to_image"
            :src="selectedArticle.img_url || selectedArticle.url_to_image"
            alt="Nyhetsbild"
            class="rounded-xl mb-4 w-full object-cover max-h-72"
          />
          <p class="text-sm text-gray-500 mb-2">
            {{ selectedArticle.author || selectedArticle.byline }} – {{ selectedArticle.published_at?.substring(0, 20) || selectedArticle.published_date?.substring(0, 20) }}
          </p>
          <p class="text-gray-700">{{ selectedArticle.content || selectedArticle.abstract || selectedArticle.description }}</p>
          <div class="mt-4">
            <a
              :href="selectedArticle.url"
              target="_blank"
              class="text-blue-600 hover:underline"
            >
              Öppna originalartikel
            </a>
          </div>
        </div>
      </UModal>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useSupabaseClient, useSupabaseUser } from '#imports'
  
  const articles = ref([])
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const showModal = ref(false)
  const selectedArticle = ref(null)
  
  const openModal = (article) => {
    selectedArticle.value = article
    showModal.value = true
  }
  
  const fetchArticles = async () => {
    try {
      const [resNewsapi, resNyt] = await Promise.all([
        $fetch('/api/news/list'),
        $fetch('/api/news/list2')
      ])
      const combined = [...resNewsapi.data, ...resNyt.data]
      const uniqueArticles = combined.filter(
        (article, index, self) =>
          article.url &&
          self.findIndex(a => a.url === article.url) === index
      )
      articles.value = uniqueArticles
    } catch (err) {
      console.error('Kunde inte hämta artiklar:', err)
    }
  }
  
  const sortedArticles = computed(() => {
    return [...articles.value].sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
  })
  
  const toggleLike = async (newsId) => {
    if (!user.value) {
      alert('Du måste vara inloggad för att gilla.')
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
  