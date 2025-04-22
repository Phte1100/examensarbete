<template>
  <div class="p-6">
    <!-- Nyheter från Supabase -->
    <div v-if="results.news?.length" class="mt-6">
      <h2 class="text-lg font-bold">#Nyheter</h2>
      <ul class="space-y-2">
        <li v-for="(item, index) in visible.news ? results.news : results.news.slice(0, 5)" :key="'news-' + index">
          <a :href="item.url" target="_blank" class="text-gray-800 hover:underline block">{{ item.title }}</a>
          <p class="text-sm text-gray-500">{{ item.published_at?.substring(0, 10) }} – {{ item.source_name }}</p>
        </li>
      </ul>
      <button
        v-if="results.news.length > 5"
        @click="visible.news = !visible.news"
        class="text-sm mt-2 text-gray-600 hover:underline"
      >
        {{ visible.news ? 'Visa färre' : 'Visa fler' }}
      </button>
    </div>

    <!-- Stack Overflow -->
    <div v-if="results.stackoverflow?.length" class="mt-6">
      <h2 class="text-lg font-bold">#Stack Overflow</h2>
      <div
        v-for="(item, index) in visible.stackoverflow ? results.stackoverflow : results.stackoverflow.slice(0, 5)"
        :key="'so-' + index"
        class="mt-2 flex justify-between gap-2"
      >
        <a :href="item.link" target="_blank" class="text-blue-600 hover:underline flex-1">
          {{ item.title }}
        </a>
        <button @click="saveThread(item, 'stackoverflow')" class="text-sm text-blue-500 hover:underline">📌</button>
      </div>
      <button
        v-if="results.stackoverflow.length > 5"
        @click="visible.stackoverflow = !visible.stackoverflow"
        class="text-sm mt-2 text-blue-500 hover:underline"
      >
        {{ visible.stackoverflow ? 'Visa färre' : 'Visa fler' }}
      </button>
    </div>

    <!-- Hacker News -->
    <div v-if="results.hackernews?.length" class="mt-6">
      <h2 class="text-lg font-bold">#Hacker News</h2>
      <div
        v-for="(item, index) in visible.hackernews ? results.hackernews : results.hackernews.slice(0, 5)"
        :key="'hn-' + index"
        class="mt-2 flex justify-between gap-2"
      >
        <a :href="item.link" target="_blank" class="text-orange-600 hover:underline flex-1">
          {{ item.title }}
        </a>
        <button @click="saveThread(item, 'hackernews')" class="text-sm text-orange-500 hover:underline">📌</button>
      </div>
      <button
        v-if="results.hackernews.length > 5"
        @click="visible.hackernews = !visible.hackernews"
        class="text-sm mt-2 text-orange-500 hover:underline"
      >
        {{ visible.hackernews ? 'Visa färre' : 'Visa fler' }}
      </button>
    </div>

    <!-- Dev.to -->
    <div v-if="results.devto?.length" class="mt-6">
      <h2 class="text-lg font-bold">#Dev.to</h2>
      <div
        v-for="(item, index) in visible.devto ? results.devto : results.devto.slice(0, 5)"
        :key="'devto-' + index"
        class="mt-2 flex justify-between gap-2"
      >
        <a :href="item.url" target="_blank" class="text-indigo-600 hover:underline flex-1">
          {{ item.title }}
        </a>
        <button @click="saveThread(item, 'devto')" class="text-sm text-indigo-500 hover:underline">📌</button>
      </div>
      <button
        v-if="results.devto.length > 5"
        @click="visible.devto = !visible.devto"
        class="text-sm mt-2 text-indigo-500 hover:underline"
      >
        {{ visible.devto ? 'Visa färre' : 'Visa fler' }}
      </button>
    </div>

    <!-- Inga resultat -->
    <p
      v-if="searched && !results.news?.length && !results.stackoverflow?.length && !results.hackernews?.length && !results.devto?.length"
      class="mt-4 text-red-600"
    >
      Inga resultat hittades.
    </p>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const query = useState('searchQuery', () => '')
const searched = ref(false)

const results = ref({
  news: [],
  stackoverflow: [],
  hackernews: [],
  devto: []
})

const visible = ref({
  news: false,
  stackoverflow: false,
  hackernews: false,
  devto: false
})

const search = async () => {
  searched.value = true
  visible.value = { news: false, stackoverflow: false, hackernews: false, devto: false }

  const [apiRes, newsRes] = await Promise.all([
    $fetch('/api/search/fetch', {
      method: 'POST',
      body: { query: query.value }
    }),
    $fetch('/api/news/search', {
      method: 'POST',
      body: { query: query.value }
    })
  ])

  if (apiRes.success && newsRes.success) {
    results.value = {
      news: (newsRes.data || []).sort((a, b) => new Date(b.published_at) - new Date(a.published_at)),
      stackoverflow: (apiRes.stackoverflow || []).sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date)),
      hackernews: (apiRes.hackernews || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      devto: (apiRes.devto || []).sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    }
  } else {
    alert('Sökningen misslyckades.')
  }
}

watchEffect(() => {
  if (query.value.trim()) {
    search()
  }
})

const saveThread = async (item, source) => {
  if (!user.value) {
    alert('Du måste vara inloggad för att spara trådar.')
    return
  }

  const { error } = await supabase.from('saved_threads').insert([
    {
      user_id: user.value.id,
      title: item.title,
      url: item.link || item.url,
      source
    }
  ])

  if (error) {
    if (error.code === '23505') {
      alert('Tråden är redan sparad.')
    } else {
      console.error('Fel vid sparning:', error)
      alert('Kunde inte spara tråden.')
    }
  } else {
    alert('Tråden sparades!')
  }
}
</script>
