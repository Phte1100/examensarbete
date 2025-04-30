<script setup>
const selectedSources = useState('selectedSources', () => [
  'wired',
  'the-verge',
  'techradar',
  'nyt'
])

const sources = [
  { label: 'Wired', value: 'wired' },
  { label: 'The Verge', value: 'the-verge' },
  { label: 'TechRadar', value: 'techradar' },
  { label: 'New York Times', value: 'nyt' },
  { label: 'Ars Technica', value: 'ars-technica' },
  { label: 'TechCrunch', value: 'techcrunch' },
  { label: 'Recode', value: 'recode' },
  { label: 'The Next Web', value: 'the-next-web' },
  { label: 'Hacker News', value: 'hacker-news' },
  { label: 'Mashable', value: 'mashable' }
]

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
  <div>
    <h2 class="font-bold text-lg">Filtrera</h2>

    <div class="mt-4">
      <h3 class="text-sm font-semibold mb-2">Artiklar</h3>
      <div class="space-y-2">
        <label
          class="flex items-center space-x-2 text-sm"
          v-for="source in sources"
          :key="source.value"
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
</template>
