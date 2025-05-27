<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')
const successMessage = ref('')
const user = useSupabaseUser()

// Hämta befintligt användarnamn
const fetchProfile = async () => {
  loading.value = true
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.value.id)
    .single()

  if (data) {
    username.value = data.username
  }

  loading.value = false
}

await fetchProfile()

// Uppdatera användarnamn
async function updateProfile() {
  try {
    loading.value = true

    const updates = {
      id: user.value.id,
      username: username.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error

    // Bekräftelse
    successMessage.value = 'Profilen har uppdaterats!'
    setTimeout(() => (successMessage.value = ''), 3000)

    await fetchProfile() // uppdaterar fältet direkt
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-widget max-w-md mx-auto p-4 space-y-4 bg-white rounded shadow" @submit.prevent="updateProfile">
    <div>
      <label for="email" class="block font-medium text-sm text-gray-700">E-post:</label>
      <input
        id="email"
        type="text"
        :value="user.email"
        disabled
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 text-gray-700"
      />
    </div>

    <div>
      <label for="username" class="block font-medium text-sm text-gray-700">Användarnamn:</label>
      <input
        id="username"
        type="text"
        v-model="username"
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div class="mt-4">
      <button
        type="submit"
        :disabled="loading"
        class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition disabled:opacity-50"
      >
        {{ loading ? 'Laddar...' : 'Uppdatera' }}
      </button>
    </div>

    <p v-if="successMessage" class="text-sm text-green-600 mt-2">{{ successMessage }}</p>
  </form>
</template>
