<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_path = ref('')

loading.value = true
const user = useSupabaseUser()

const { data } = await supabase
  .from('profiles')
  .select(`username`)
  .eq('id', user.value.id)
  .single()

if (data) {
  username.value = data.username
}

loading.value = false

async function updateProfile() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: user.value.id,
      username: username.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-widget max-w-md mx-auto p-6 bg-white rounded shadow" @submit.prevent="updateProfile">
    <Avatar v-model:path="avatar_path" @upload="updateProfile" />

    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700">E-post:</label>
      <input
        id="email"
        type="text"
        :value="user.email"
        disabled
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 text-gray-700"
      />
    </div>

    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700">Användarnamn:</label>
      <input
        id="username"
        type="text"
        v-model="username"
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div class="mb-4">
      <label for="website" class="block text-sm font-medium text-gray-700">Webbplats:</label>
      <input
        id="website"
        type="url"
        v-model="website"
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div class="mt-6">
      <input
        type="submit"
        :value="loading ? 'Laddar...' : 'Uppdatera'"
        :disabled="loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
      />
    </div>

    <div class="mt-4">
      <button
        @click="signOut"
        type="button"
        :disabled="loading"
        class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
      >
        Logga ut
      </button>
    </div>
  </form>
</template>
