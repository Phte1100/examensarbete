<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const username = ref('')
const website = ref('')
const loading = ref(false)

const submit = async () => {
  loading.value = true
  const updates = {
    id: user.value.id,
    username: username.value,
    website: website.value,
    updated_at: new Date(),
  }

  const { error } = await supabase.from('profiles').upsert(updates)

  if (!error) {
    router.push('/')
  } else {
    alert(error.message)
  }

  loading.value = false
}
</script>

<template>
  <div class="container">
    <h2>Vänligen fyll i din profil</h2>
    <form @submit.prevent="submit">
      <div>
        <label for="username">Användarnamn</label>
        <input id="username" v-model="username" required />
      </div>
      <div>
        <label for="website">Webbplats</label>
        <input id="website" v-model="website" />
      </div>
      <button :disabled="loading">{{ loading ? 'Sparar...' : 'Spara' }}</button>
    </form>
  </div>
</template>
