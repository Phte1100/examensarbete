<template>
  <div v-if="article" class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ article.title }}</h1>

    <img
      v-if="article.img_url || article.url_to_image"
      :src="article.img_url || article.url_to_image"
      class="rounded-xl mb-4 w-full object-cover"
    />

    <p class="text-sm text-gray-500 mb-2">
      {{ article.author || article.byline }} – 
      {{ article.published_at?.substring(0, 20) || article.published_date?.substring(0, 20) }}
    </p>

    <p class="text-gray-700 mb-4">
      {{ article.content || article.abstract || article.description }}
    </p>

    <!-- ❤️ 📌 Actions -->
    <div class="flex items-center space-x-4" v-if="ready">
      <LikeButton
        v-if="user"
        :article-id="article.id"
        :initial-likes="likeCount"
        :initial-user-liked="userHasLiked"
      />

      <BookmarkButton v-if="user" :article="article" />

      <a
        :href="article.url"
        target="_blank"
        rel="noopener"
        class="text-sm font-semibold text-gray-900 hover:underline"
      >
        Läs originalartikeln <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </div>

  <div v-else class="text-center p-10 text-gray-500">Laddar artikel...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import LikeButton from '~/components/LikeButton.vue'
import BookmarkButton from '~/components/BookmarkButton.vue'

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const article = ref(null)
const likeCount = ref(0)
const userHasLiked = ref(false)
const ready = ref(false) // 👈 Ny flagga

const fetchArticle = async () => {
  try {
    const [resNewsapi, resNyt] = await Promise.all([
      $fetch('/api/news/list'),
      $fetch('/api/news/list2')
    ])
    const all = [...resNewsapi.data, ...resNyt.data]
    article.value = all.find((a) => a.url === route.query.url)

    if (article.value?.content) {
      article.value.content = article.value.content.replace(/\s*\[\+\d+ chars\]/, '')
    }
  } catch (err) {
    console.error('Kunde inte ladda artikeln:', err)
  }
}

const fetchLikes = async () => {
  if (!article.value || !article.value.id) return

  const { data, error } = await supabase
    .from('likes')
    .select('user_id')
    .eq('news_id', article.value.id)

  if (error) {
    console.error('Kunde inte hämta likes:', error)
    return
  }

  likeCount.value = data.length
  userHasLiked.value = user.value ? data.some((like) => like.user_id === user.value.id) : false
}

onMounted(async () => {
  await fetchArticle()
  await fetchLikes()
  ready.value = true // 👈 Nu kan vi visa knappen
})
</script>
