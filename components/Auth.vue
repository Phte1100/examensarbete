<script setup>
const supabase = useSupabaseClient()

const email = ref('')
const loading = ref(false)
const step = ref('enter-email')
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
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Logga in på Learnit
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
      <!-- Sektion: E-post och pinkod -->
      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Logga in med e-post och pinkod</h3>
        <form @submit.prevent="step === 'enter-email' ? requestOtp() : verifyOtp()" class="space-y-4">
          <!-- E-post -->
          <div v-if="step === 'enter-email'">
            <label for="email" class="block text-sm font-medium text-gray-900">E-postadress</label>
            <div class="mt-1">
              <input
                v-model="email"
                id="email"
                name="email"
                type="email"
                required
                autocomplete="email"
                placeholder="din@epost.se"
                class="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Pinkod -->
          <div v-else>
            <label for="code" class="block text-sm font-medium text-gray-900">Pinkod</label>
            <div class="mt-1">
              <input
                v-model="code"
                id="code"
                name="code"
                type="text"
                maxlength="6"
                required
                placeholder="Ange pinkoden"
                class="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Skicka/logga in-knapp -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Laddar...' : step === 'enter-email' ? 'Skicka kod' : 'Logga in' }}
          </button>
        </form>
      </div>

      <!-- Separator -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-base">
          <span class="px-2 text-white-500">eller</span>
        </div>
      </div>

      <!-- Google-knapp -->
      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Logga in med Google</h3>
        <button
          @click="loginWithGoogle"
          type="button"
          class="flex w-full justify-center items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          :disabled="loading"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
          Logga in med Google
        </button>
      </div>

      <!-- Meddelande -->
      <p v-if="message" class="text-center text-sm text-gray-600">
        {{ message }}
      </p>
    </div>
  </div>
</template>
