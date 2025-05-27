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
  <form class="form-widget" @submit.prevent="updateProfile">
    <Avatar v-model:path="avatar_path" @upload="updateProfile" />
    <div>
      <label for="email">E-post:</label><br>
      <input id="email" type="text" :value="user.email" disabled />
    </div>
    <div>
      <label for="username">Användarnamn:</label><br>
      <input id="username" type="text" v-model="username" />
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