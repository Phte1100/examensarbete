<template>
  <div class="relative min-h-screen">
    <div class="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 class="mb-4 text-4xl font-bold leading-none tracking-tight text-black-900 md:text-5xl lg:text-6xl ">Learnit => Knowit</h1>
      <div
        class="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:gap-x-3 lg:space-y-0"
        style="max-width: 1200px;"
      >
      <div class="col-span-1">
    <Sidebar />
  </div>

      <div class="col-span-2 col-start-2 col-end-4">
        <List />
      </div>
      <div class="col-span-1 space-y-6">
  <div>
    <h2 class="font-bold">#Stack Overflow</h2>
    <ul>
      <li v-for="item in latestThreads.stackoverflow" :key="item.link">
        <a :href="item.link" class="hover:underline" style="color: #333366">
  {{ item.title }}
  <USeparator />
</a>
      </li>
    </ul>
  </div>

  <div>
    <h2 class="font-bold">#Hacker News</h2>
    <ul>
      <li v-for="item in latestThreads.hackernews" :key="item.link">
        <a :href="item.link" class="hover:underline" style="color: #00473C">
  {{ item.title }}
</a>
<USeparator />
      </li>
    </ul>
  </div>

  <div>
    <h2 class="font-bold">#Dev.to</h2>
    <ul>
      <li v-for="item in latestThreads.devto" :key="item.link">
        <a :href="item.link" class="hover:underline" style="color: #333366">
  {{ item.title }}
</a>
<USeparator />
      </li>
    </ul>
  </div>
</div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const latestThreads = ref({
  stackoverflow: [],
  hackernews: [],
  devto: []
})

const fetchLatestThreads = async () => {
  const res = await $fetch('/api/search/fetch', {
    method: 'POST',
    body: { query: '' }
  })

  if (res.success) {
    latestThreads.value = {
      stackoverflow: res.stackoverflow.slice(0, 5),
      hackernews: res.hackernews.slice(0, 5),
      devto: res.devto.slice(0, 5)
    }
  }
}

onMounted(fetchLatestThreads)

const handleClick = async () => {
  try {
    const response = await $fetch('/api/news/fetch', { method: 'POST' })
    if (response.success) {
      alert(`Hämtade och sparade ${response.inserted} artiklar till Supabase!`)
    } else {
      alert('Något gick fel.')
    }
  } catch (err) {
    console.error(err)
    alert('Fel vid API-anropet.')
  }
}
</script>

