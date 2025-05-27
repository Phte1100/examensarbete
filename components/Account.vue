<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')
const successMessage = ref('')
const user = useSupabaseUser()

const emit = defineEmits(['updated'])

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

    successMessage.value = 'Profilen har uppdaterats!'
    emit('updated') // Skicka signal till förälder

    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div>
      <label for="email">E-post:</label><br>
      <input id="email" type="text" :value="user.email" disabled />
    </div>
    <div>
      <label for="username">Användarnamn:</label><br>
      <input id="username" type="text" v-model="username" />
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