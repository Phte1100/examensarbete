<template>
  <div v-if="article" class="gradient-card max-w-3xl mx-auto mt-8">
    <div class="content-wrapper p-4">
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
  const ready = ref(false)
  
  
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
    ready.value = true
  })
  </script>
  
  
  <style scoped>
  .gradient-card {
    position: relative;
    border-radius: 0.75rem;
    padding: 0.15rem; /* gör plats för ramen */
    z-index: 1;
    overflow: visable;
  }
  
  
  .gradient-card::before,
  .gradient-card::after {
    content: "";
    position: absolute;
    inset: -0.50rem;
    z-index: -1;
    background: conic-gradient(
      from var(--gradient-angle),
      var(--clr-5),
      var(--clr-4),
      var(--clr-3),
      var(--clr-4),
      var(--clr-5)
    );
    border-radius: inherit;
    animation: rotation 20s linear infinite;
  }
  
  .gradient-card::after {
    filter: blur(3.5rem);
  }
  
  
  .content-wrapper {
    background: white;
    border-radius: 0.625rem;
    padding: 2rem;
  }
  
  
  
  
  @keyframes rotation {
    0% {
      --gradient-angle: 0deg;
    }
    100% {
      --gradient-angle: 360deg;
    }
  }

  @media (prefers-reduced-motion: reduce) {
  .gradient-card::before,
  .gradient-card::after {
    animation: none !important;
    }
  }


  </style>
  
  
  <style>
  @property --gradient-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
  
  
  
  
  :root {
   /*--clr-3: #FFD6B8;*/
    --clr-3: #FFD6B8;
    --clr-4: #CFCEFF;
    --clr-5: #372BC5;
  }
  </style>
  