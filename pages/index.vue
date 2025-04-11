<template>
  <div class="relative min-h-screen">
    <div class="flex flex-col items-center justify-center min-h-screen p-6">

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
        <UnifiedSearch />
      </div>
      <NyNewsx3 />
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
