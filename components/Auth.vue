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
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Logga in med e-post och pinkod
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="step === 'enter-email' ? requestOtp() : verifyOtp()" class="space-y-6">
        <!-- E-post -->
        <div v-if="step === 'enter-email'">
          <label for="email" class="block text-sm font-medium text-gray-900">E-postadress</label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              required
              autocomplete="email"
              placeholder="din@epost.se"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <!-- Pinkod -->
        <div v-else>
          <label for="code" class="block text-sm font-medium text-gray-900">Pinkod</label>
          <div class="mt-2">
            <input
              v-model="code"
              id="code"
              name="code"
              type="text"
              maxlength="6"
              required
              placeholder="Ange pinkoden"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <!-- Submit-knapp -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {{ loading ? 'Laddar...' : step === 'enter-email' ? 'Skicka kod' : 'Logga in' }}
          </button>
        </div>
      </form>

      <p v-if="message" class="mt-4 text-center text-sm text-gray-600">
        {{ message }}
      </p>
    </div>
  </div>
</template>
