<template>
    <div class="max-w-4xl mx-auto p-6 space-y-8">
      <h1 class="text-2xl font-bold">Mina sidor</h1>
  
      <!-- Profilinformation -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Profil</h2>
        <p><strong>Användarnamn:</strong> {{ profile?.username }}</p>
<p><strong>Fullständigt namn:</strong> {{ profile?.full_name }}</p>

      </section>
  
      <!-- Sparade artiklar -->
      <section v-if="articles.length">
  <h2 class="text-xl font-semibold mb-2">Sparade artiklar</h2>
  <ul class="divide-y">
  <li
    v-for="a in articles"
    :key="a.id"
    class="flex justify-between items-center py-4"
  >
    <div>
      <p class="text-sm text-black-500">
        {{ a.published_at?.substring(0, 10) }}
      </p>
      <a
        :href="a.url"
        class="text-base font-medium text-black hover:underline"
        target="_blank"
      >
        {{ a.title }}
      </a>
      <p class="text-sm text-black-500">
      {{ a.source || 'Okänd' }}
      </p>
    </div>

    <button
      @click="deleteArticle(a.id)"
      class="material-symbols-outlined text-black-500 hover:text-red-600 transition"
      title="Ta bort"
    >
      delete
    </button>
  </li>
</ul>

</section>

  
      <!-- Sparade trådar -->
      <section v-if="threads.length">
  <h2 class="text-xl font-semibold mb-2">Sparade trådar</h2>
  <ul class="divide-y">
  <li
    v-for="t in threads"
    :key="t.id"
    class="flex justify-between items-center py-4"
  >
    <div>
      <p class="text-sm text-black-500">
        {{ t.created_at?.substring(0, 10) }}
      </p>
      <a
        :href="t.url"
        class="text-base font-medium text-black hover:underline"
        target="_blank"
      >
        {{ t.title }}
      </a>
      <p class="text-sm text-black-500">
      {{ t.source }}
      </p>
    </div>

    <button
      @click="deleteThread(t.id)"
      class="material-symbols-outlined text-black-500 hover:text-red-600 transition"
      title="Ta bort"
    >
      delete
    </button>
  </li>
</ul>

</section>

    </div>
  </template>
  
  <script setup>
  const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const profile = ref(null)
const articles = ref([])
const threads = ref([])

const deleteArticle = async (id) => {
  const { error } = await supabase.from('saved_articles').delete().eq('id', id)
  if (!error) {
    articles.value = articles.value.filter((a) => a.id !== id)
  } else {
    alert('Kunde inte ta bort artikel.')
  }
}

const deleteThread = async (id) => {
  const { error } = await supabase.from('saved_threads').delete().eq('id', id)
  if (!error) {
    threads.value = threads.value.filter((t) => t.id !== id)
  } else {
    alert('Kunde inte ta bort tråd.')
  }
}

watchEffect(async () => {
  if (!user.value) return

  // Hämta profil
  const { data: p, error: profileError } = await supabase
    .from('profiles')
    .select('username, full_name')
    .eq('id', user.value.id)
    .single()

  if (profileError) console.error('Profilfel:', profileError)
  profile.value = p

  // Hämta artiklar
  const { data: a } = await supabase
    .from('saved_articles')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
  articles.value = a || []

  // Hämta trådar
  const { data: t } = await supabase
    .from('saved_threads')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
  threads.value = t || []
})
  </script>
  