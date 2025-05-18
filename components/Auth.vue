<script setup>
const supabase = useSupabaseClient()

const email = ref('')
const loading = ref(false)
const step = ref('enter-email')
const code = ref('')
const message = ref('')

// kontrollera om användaren är inloggad
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

// verifiera pinkoden
async function verifyOtp() {
  loading.value = true
  const { error } = await supabase.auth.verifyOtp({
    email: email.value,
    token: code.value,
    type: 'email'
  })

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Inloggningen lyckades!'
    window.location.href = '/confirm'
  }
  loading.value = false
}

// logga in med Google
const loginWithGoogle = async () => {
  loading.value = true
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/confirm'
    }
  })
  if (error) {
    message.value = error.message
  }
  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 px-4">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Logga in på Learnit</h2>

      <form @submit.prevent="step === 'enter-email' ? requestOtp() : verifyOtp()" class="space-y-4">
        <div v-if="step === 'enter-email'">
          <label class="block text-sm font-medium text-gray-700">E-postadress</label>
          <input
            v-model="email"
            type="email"
            placeholder="din@epost.se"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div v-else>
          <label class="block text-sm font-medium text-gray-700">Pinkod</label>
          <input
            v-model="code"
            type="text"
            maxlength="6"
            placeholder="Ange pinkoden"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-2 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {{ loading ? 'Laddar...' : step === 'enter-email' ? 'Skicka kod' : 'Logga in' }}
        </button>
      </form>

      <div class="text-center text-gray-500">eller</div>

      <button
        @click="loginWithGoogle"
        type="button"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
        Logga in med Google
      </button>

      <p v-if="message" class="text-center text-sm text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

