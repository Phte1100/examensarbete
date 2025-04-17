<template>
  <Disclosure as="nav" class="sticky top-0 z-50 bg-white/70 backdrop-blur" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logga -->
        <NuxtLink to="/" class="text-2xl font-bold text-gray-900 ">
          Learnit
        </NuxtLink>

        <!-- Sökfält -->
        <div class="flex-1 flex justify-center px-4">
          <form class="search-form w-full max-w-xl" @submit.prevent="goToSearch">
  <input
    v-model="query"
    type="text"
    placeholder="Sök..."
    class="w-full px-4 py-2 rounded border"
  />
</form>
</div>


        <!-- Desktop länk -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="user">
  <button
    @click="signOut"
    class="text-base font-semibold text-gray-900 hover:underline "
  >
    Logga ut
  </button>
</template>
<template v-else>
  <NuxtLink
    to="/login"
    class="text-base font-semibold text-gray-900 hover:underline"
  >
    Logga in / Registrera
  </NuxtLink>
</template>

        </div>

        <!-- Mobilmenyknapp -->
        <div class="md:hidden">
          <DisclosureButton class="inline-flex items-center justify-center p-2 text-gray-600 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none">
            <Bars3Icon v-if="!open" class="h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- Mobilmeny -->
    <DisclosurePanel class="md:hidden bg-white/90">
  <div class="px-2 pt-2 pb-3 space-y-1">
    <template v-if="user">
      <button
        @click="signOut"
        class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
      >
        Logga ut
      </button>
    </template>
    <template v-else>
      <NuxtLink
        to="/login"
        class="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
      >
        Logga in / Registrera
      </NuxtLink>
    </template>
  </div>
</DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const query = useState('searchQuery', () => '')
const router = useRouter()

const goToSearch = () => {
  if (query.value.trim()) {
    router.push('/search')
  }
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  router.push('/login')
  if (error) {
    alert('Kunde inte logga ut: ' + error.message)
  }
}

</script>
