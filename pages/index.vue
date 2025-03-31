<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-4xl font-bold text-blue-600 mb-4">Welcome to My Nuxt 3 App</h1>
        <p class="text-lg text-gray-700">This is a simple example of a Nuxt 3 application.</p>
        <button class="button-64" type="submit" @click="handleClick">Hämta artiklar</button>
        <NewsList />
        <StackOverflowSearch />
    </div>
    <Marquee />
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