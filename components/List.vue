<template>
  <!-- Visa skeletons om loading -->
<div v-if="loading" class="mt-8 space-y-6">
  <SkeletonCard v-for="n in 5" :key="n" />
</div>

<!-- Visa riktiga artiklar -->
<div v-else-if="sortedArticles.length" class="mt-8 space-y-6">
    <div
      v-for="(article, index) in paginatedArticles"
      :key="index"
      class="rounded-3xl p-[3px] bg-gradient-to-br from-[#55D440] via-[#372BC5] to-[#0B0B26] hover:scale-[1.02] transition-transform"
    >
      <div class="bg-white rounded-[22px] p-5 shadow hover:shadow-[0_6px_18px_-2px_#808080]">
        <!-- Bild -->
        <div v-if="article.img_url || article.url_to_image" class="mb-4">
          <img
            :src="article.img_url || article.url_to_image"
            alt=""
            role="presentation"
            class="rounded-xl w-full object-cover max-h-60"
          />
        </div>

        <!-- Källa -->
        <span class="text-base bg-gray-800 text-white px-2 py-1 rounded-full mb-2 inline-block">
          {{ article.source_name || article.source || 'New York Times' }}
        </span>

        <!-- Titel och info -->
        <h2 class="text-xl font-bold text-gray-800 mb-1">
  <NuxtLink
    :to="`/singel?url=${encodeURIComponent(article.url)}`"
    class="hover:underline hover:text-indigo-600"
  >
    {{ article.title }} <span aria-hidden="true">&rarr;</span>
  </NuxtLink>
</h2>

        <p class="text-sm text-gray-500 mb-2">
          {{ article.author || article.byline }} –
          {{ new Date(article.published_at || article.published_date).toLocaleDateString() }}

        </p>
        <p class="text-gray-700 mb-2">{{ article.description || article.abstract }}</p>

        <!-- Interaktiva knappar -->
        <div class="flex items-center space-x-4">
          <LikeButton
            v-if="user"
            :article-id="article.id"
            :initial-likes="article.likes"
            :initial-user-liked="article.userHasLiked"
          />

          <BookmarkButton v-if="user" :article="article" />
        </div>
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
const loading = ref(true)


// Globalt filter-state
const selectedSources = useState('selectedSources', () => ['wired', 'the-verge', 'techradar', 'nyt'])

// Källa → identifieringar som kan förekomma i artiklar
const sourceMap = {
  wired: 'wired',
  'the-verge': 'the verge',
  techradar: 'techradar',
  nyt: 'new york times',
  'ars-technica': 'ars technica',
  techcrunch: 'techcrunch',
  recode: 'recode',
  'the-next-web': 'the next web',
  'hacker-news': 'hacker news',
  mashable: 'mashable'
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
    loading.value = false
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
                          : rawSource.includes('the new york times') ? 'nyt'
                          : rawSource.includes('wired') ? 'wired'
                          : rawSource.includes('ars technica') ? 'ars-technica'
                          : rawSource.includes('recode') ? 'recode'
                          : rawSource.includes('the next web') ? 'the-next-web'
                          : rawSource.includes('hacker news') ? 'hacker-news'
                          : rawSource.includes('mashable') ? 'mashable'
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
