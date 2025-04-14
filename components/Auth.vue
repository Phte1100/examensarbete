<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
  email: email.value,
  options: {
    shouldCreateUser: true,
    emailRedirectTo: '/confirm' // eller produktions-URL
  }
})

    alert('Check your email for the login link!')
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleLogin">
      <p class="description">Logga in med din epost-adress</p>
      <div class="form-group">
        <input type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button-64"
          :value="loading ? 'Laddar' : 'Skickar magic link'"
          :disabled="loading"
        />
      </div>
  </form>
</template>