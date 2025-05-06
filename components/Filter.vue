<script setup>
import { onMounted, watch } from 'vue'

const STORAGE_KEY = 'selectedSources'

const selectedSources = useState('selectedSources', () => [])

const sources = [
  { label: 'Wired', value: 'wired', description: 'Amerikansk teknik- och kulturpublikation' },
  { label: 'The Verge', value: 'the-verge', description: 'Tekniknyheter, recensioner och guider' },
  { label: 'TechRadar', value: 'techradar', description: 'Fokus på konsumentteknik, tester och guider' },
  { label: 'New York Times', value: 'nyt', description: 'Anrik amerikansk dagstidning med global bevakning' },
  { label: 'Ars Technica', value: 'ars-technica', description: 'Djupgående teknik- och vetenskapsjournalistik' },
  { label: 'TechCrunch', value: 'techcrunch', description: 'Startups, investeringar och techindustrin' },
  { label: 'Recode', value: 'recode', description: 'Analys och nyheter inom teknik och media' },
  { label: 'The Next Web', value: 'the-next-web', description: 'Technyheter från ett globalt perspektiv' },
  { label: 'Hacker News', value: 'hacker-news', description: 'Community-baserade tekniknyheter och diskussioner' },
  { label: 'Mashable', value: 'mashable', description: 'Tech och popkultur med ett brett fokus' }
]


// Ladda från localStorage vid sidladdning
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    selectedSources.value = JSON.parse(saved)
  } else {
    selectedSources.value = sources.map(s => s.value) // default: alla valda
  }
})

// Spara automatiskt när användaren ändrar val
watch(selectedSources, (newValue) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
}, { deep: true })

const toggleSource = (source) => {
  const index = selectedSources.value.indexOf(source)
  if (index > -1) {
    selectedSources.value.splice(index, 1)
  } else {
    selectedSources.value.push(source)
  }
}
</script>


<template>
  <aside class="p-4 space-y-4 text-lg text-gray-800 sticky top-20 h-fit ml-10">
  <div>
    <h2 class="font-bold text-xl">Filtrera</h2>

    <div class="mt-4">
      <h3 class="text-l font-semibold mb-2">Artiklar</h3>
      <div class="space-y-2">
        <label
  class="flex items-center space-x-2 text-base"
  v-for="source in sources"
  :key="source.value"
  :title="source.description"
>
  <input
    type="checkbox"
    :value="source.value"
    :checked="selectedSources.includes(source.value)"
    @change="toggleSource(source.value)"
    class="accent-gray-500 rounded"
  />
  <span>{{ source.label }}</span>
</label>

      </div>
    </div>
  </div>
</aside>
</template>
