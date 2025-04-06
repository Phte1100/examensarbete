<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
    <h1 class="text-4xl font-extrabold text-blue-700 mb-2 text-center">🎉 Welcome to Learnit</h1>
    <p class="text-lg text-gray-600 mb-6 text-center max-w-xl">
      Upptäck tech-nyheter & Stack Overflow-svar med en Nuxt 3-app!
    </p>
    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow mb-6" @click="handleClick">
      🔄 Hämta artiklar
    </button>
    <NewsList />
    <div class="mt-10 w-full max-w-2xl">
      <StackOverflowSearch />
    </div>
  </div>
</template>

<script setup>

const handleClick = async () => {
  try {
    const response = await $fetch('/api/news/fetch', {
      method: 'POST',
    })

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