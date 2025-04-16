<script setup>
const supabase = useSupabaseClient()

const email = ref('')
const loading = ref(false)
const step = ref('enter-email') // 'enter-email' | 'enter-code'
const code = ref('')
const message = ref('')

async function requestOtp() {
  loading.value = true
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: { shouldCreateUser: true }
  })

  if (error) {
    message.value = error.message
  } else {
    message.value = 'En pinkod har skickats till din e-post.'
    step.value = 'enter-code'
  }
  loading.value = false
}

async function verifyOtp() {
  loading.value = true
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.value,
    token: code.value,
    type: 'email'
  })

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Inloggningen lyckades!'
    window.location.href = '/confirm' // går till confirm.vue som redirectar
  }
  loading.value = false
}
</script>

<template>
  <form @submit.prevent="step === 'enter-email' ? requestOtp() : verifyOtp()">
    <p class="description">Logga in med e-post och pinkod</p>

    <div v-if="step === 'enter-email'" class="form-group">
      <input type="email" placeholder="Din e-post" v-model="email" required />
    </div>

    <div v-else class="form-group">
      <input type="text" maxlength="6" placeholder="Ange pinkoden" v-model="code" required />
    </div>

    <div>
      <input
        type="submit"
        class="button-64"
        :value="loading ? 'Laddar...' : (step === 'enter-email' ? 'Skicka kod' : 'Logga in')"
        :disabled="loading"
      />
    </div>

    <p v-if="message" class="message">{{ message }}</p>
  </form>
</template>
