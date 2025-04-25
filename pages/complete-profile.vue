<script setup>
import { ref, computed } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const username = ref('')
const loading = ref(false)
const errorMessage = ref('')

const isValid = computed(() => username.value.trim().length > 2)

const submit = async () => {
  if (!isValid.value) {
    errorMessage.value = 'Användarnamnet måste vara minst 3 tecken.'
    return
  }

  loading.value = true

  const updates = {
    id: user.value.id,
    username: username.value.trim(),
    updated_at: new Date()
  }

  const { error } = await supabase.from('profiles').upsert(updates)

  if (!error) {
    router.push('/')
  } else {
    errorMessage.value = error.message
  }

  loading.value = false
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Skapa din profil
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="submit" class="space-y-6">
        <!-- Användarnamn -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-900">Användarnamn</label>
          <div class="mt-2">
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Välj ett användarnamn"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
            />
            <p v-if="username && !isValid" class="text-sm text-red-500 mt-1">
              Användarnamnet måste vara minst 3 tecken.
            </p>
          </div>
        </div>

        <!-- Submit -->
        <div>
          <button
            type="submit"
            :disabled="loading || !isValid"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {{ loading ? 'Sparar...' : 'Spara' }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="mt-4 text-center text-sm text-red-500">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
