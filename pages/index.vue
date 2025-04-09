<template>
  <!-- Fluff-bakgrunder -->
  <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <!-- Top original -->
    <div class="absolute inset-x-0 -top-40 transform-gpu blur-3xl sm:-top-80">
      <div
        class="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-300 to-indigo-300 opacity-30"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      />
    </div>

    <!-- Bottom original -->
    <div class="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu blur-3xl sm:top-[calc(100%-30rem)]">
      <div
        class="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-pink-300 to-indigo-300 opacity-30"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      />
    </div>

    <!-- Extra Fluff Layer 1 -->
    <div class="absolute top-1/4 left-1/3 transform-gpu blur-2xl rotate-12 opacity-20">
      <div class="w-[40rem] h-[40rem] bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 rounded-full" />
    </div>

    <!-- Extra Fluff Layer 2 -->
    <div class="absolute bottom-1/4 right-1/4 transform-gpu blur-2xl -rotate-6 opacity-20">
      <div class="w-[30rem] h-[30rem] bg-gradient-to-tr from-indigo-400 via-sky-300 to-teal-200 rounded-full" />
    </div>
  </div>

  <!-- Innehåll -->
  <div class="relative min-h-screen">
    <intro />
    <USeparator />

    <div class="flex flex-col items-center justify-center min-h-screen p-6">
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow mb-6"
        @click="handleClick"
      >
        🔄 Hämta artiklar
      </button>

      <div
        class="mt-6 space-y-12 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:space-y-0"
        style="max-width: 1200px;"
      >
        <UnifiedSearch />
        <NewsList />
      </div>
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
