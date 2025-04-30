<template>
  <div v-if="sortedArticles.length" class="mt-8 space-y-6">
    <div
      v-for="(article, index) in paginatedArticles"
      :key="index"
      class="border border-gray-200 rounded-3xl p-5 transition-shadow hover:scale-[1.02] hover:shadow-[0_6px_18px_-2px_#808080] bg-white"
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
        {{ article.author || article.byline }} –
        {{
          article.published_at?.substring(0, 20) || article.published_date?.substring(0, 20)
        }}
      </p>
      <p class="text-gray-700 mb-2">{{ article.description || article.abstract }}</p>

      <div class="flex items-center space-x-4">
        <LikeButton
  v-if="user"
  :article-id="article.id"
  :initial-likes="article.likes"
  :initial-user-liked="article.userHasLiked"
/>


<BookmarkButton v-if="user" :article="article" />

        <NuxtLink
          :to="`/singel?url=${encodeURIComponent(article.url)}`"
          class="text-sm font-semibold text-gray-900"
        >
          Läs mer <span aria-hidden="true">&rarr;</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Pagineringskontroller -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="sortedArticles.length"
      :per-page="perPage"
      @update:page="currentPage = $event"
    />

    <USeparator class="my-8" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

// State
const articles = ref([])
const currentPage = ref(1)
const perPage = 5
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Globalt filter-state
const selectedSources = useState('selectedSources', () => ['wired', 'the-verge', 'techradar', 'nyt'])

// Källa → identifieringar som kan förekomma i artiklar
const sourceMap = {
  wired: 'wired',
  'the-verge': 'the verge',
  techradar: 'techradar',
  nyt: 'new york times'
}


// Hämta artiklar
const fetchArticles = async () => {
  try {
    const [resNewsapi, resNyt] = await Promise.all([
      $fetch('/api/news/list'),
      $fetch('/api/news/list2')
    ])
    const combined = [...resNewsapi.data, ...resNyt.data]
    const uniqueArticles = combined.filter(
      (article, index, self) =>
        article.url && self.findIndex(a => a.url === article.url) === index
    )

    // Hämta likes från Supabase
    const { data: likesData } = await supabase.from('likes').select('*')

    const userId = user.value?.id

    // Lägg till likes + om användaren har gillat
    const enriched = uniqueArticles.map(article => {
      const count = likesData.filter(l => l.news_id === article.id).length
      const hasLiked = likesData.some(l => l.news_id === article.id && l.user_id === userId)

      return {
        ...article,
        likes: count,
        userHasLiked: hasLiked
      }
    })

    articles.value = enriched
  } catch (err) {
    console.error('Kunde inte hämta artiklar eller likes:', err)
  }
}


// Filtrera artiklar baserat på källa
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const rawSource = (article.source_name || article.source || '').toLowerCase()
    // Anpassa nycklarna så att de matchar filtreringsvärden
    const normalizedSource = rawSource.includes('techradar') ? 'techradar'
                          : rawSource.includes('techcrunch') ? 'techcrunch'
                          : rawSource.includes('the verge') ? 'the-verge'
                          : rawSource.includes('new york times') ? 'nyt'
                          : rawSource.includes('wired') ? 'wired'
                          : null

    return normalizedSource && selectedSources.value.includes(normalizedSource)
  })
})



// Sortera efter datum
const sortedArticles = computed(() =>
  [...filteredArticles.value].sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
)

// Pagination
const totalPages = computed(() => Math.ceil(sortedArticles.value.length / perPage))
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedArticles.value.slice(start, start + perPage)
})

onMounted(fetchArticles)
</script>
