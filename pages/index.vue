<template>
  <Hero />
  <div class="relative min-h-screen">
    <div class="flex flex-col items-center justify-center p-6">
      <div
        class="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:gap-x-3 lg:space-y-0"
        style="max-width: 1200px;"
      >
      <div class="col-span-1">
    <Filter />
  </div>

      <div class="col-span-2 col-start-2 col-end-4">
        <List />
      </div>
      <div class="col-span-1 space-y-6 ml-10">
  <div>
    <h2 class="font-bold">#Stack Overflow</h2>
    <ul>
      <li v-for="item in latestThreads.stackoverflow" :key="item.link">
        <a :href="item.link" class="hover:underline text-lg" style="color: #333366">
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
        <a :href="item.link" class="hover:underline text-lg" style="color: #00473C">
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
        <a :href="item.link" class="hover:underline text-lg" style="color: #333366">
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
</script>

