<template>
    <div class="p-4 bg-white shadow rounded">
      <form @submit.prevent="search">
        <label class="block mb-2 font-semibold">Sökfråga:</label>
        <input v-model="query" type="text" class="border p-2 w-full mb-4" placeholder="t.ex. Nuxt fetch"/>
  
        <label class="block mb-2 font-semibold">Taggar (komma-separerade):</label>
        <input v-model="tagString" type="text" class="border p-2 w-full mb-4" placeholder="t.ex. javascript,nuxt"/>
  
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Sök
        </button>
      </form>
  
      <div v-if="results.length" class="mt-6 space-y-4">
        <div v-for="(item, index) in results" :key="index" class="border p-3 rounded bg-gray-50">
          <a :href="item.link" target="_blank" class="text-lg font-semibold text-blue-600">{{ item.title }}</a>
          <div class="text-sm text-gray-600">
            Tags: {{ item.tags.join(', ') }} | Score: {{ item.score }} | Svarad: {{ item.is_answered ? 'Ja' : 'Nej' }}
          </div>
        </div>
      </div>
  
      <p v-if="!loading && results.length === 0 && searched">Inga resultat hittades.</p>
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
  