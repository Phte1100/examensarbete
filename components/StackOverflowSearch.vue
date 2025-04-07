<template>
<div class="p-6">
  <form @submit.prevent="search" class="space-y-4">
    <div>
      <label class="block text-gray-700 font-semibold mb-1">Sökfråga:</label>
      <input v-model="query" type="text" class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="t.ex. Nuxt fetch"/>
    </div>

    <div>
      <label class="block text-gray-700 font-semibold mb-1">Taggar (komma-separerade):</label>
      <input v-model="tagString" type="text" class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="t.ex. javascript,nuxt"/>
    </div>

    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
      Sök
    </button>
  </form>

  <div v-if="results.length" class="mt-6 space-y-4">
    <div v-for="(item, index) in results" :key="index" class="border p-4 rounded bg-gray-50">
      <a :href="item.link" target="_blank" class="text-lg font-semibold text-blue-700 hover:underline">{{ item.title }}</a>
      <p class="text-sm text-gray-600 mt-1">
         {{ item.tags.join(', ') }} | ⭐ {{ item.score }} | Svarad: {{ item.is_answered ? 'Ja' : 'Nej' }}
      </p>
    </div>
  </div>

  <p v-if="!loading && results.length === 0 && searched" class="mt-4 text-red-600 font-medium">Inga resultat hittades.</p>
</div>

  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const query = ref('')
  const tagString = ref('')
  const results = ref([])
  const loading = ref(false)
  const searched = ref(false)
  
  const search = async () => {
    loading.value = true
    searched.value = true
    results.value = []
  
    try {
      const response = await $fetch('/api/stackoverflow/fetch', {
        method: 'POST',
        body: {
          query: query.value,
          tags: tagString.value.split(',').map(tag => tag.trim()).filter(Boolean)
        }
      })
  
      if (response.success) {
        results.value = response.data
      } else {
        alert('Något gick fel vid hämtning.')
      }
    } catch (error) {
      console.error(error)
      alert('Fel vid API-anropet.')
    }
  
    loading.value = false
  }
  </script>
  