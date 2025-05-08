<template>
    <Disclosure as="header" class="sticky top-0 z-50 bg-[#CFCEFF] text-black">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <!-- Logotyp -->
        <NuxtLink to="/" class="text-2xl font-bold text-black">
          Learnit
        </NuxtLink>
  
        <!-- Sökfält + Navigering (desktop) -->
        <div class="hidden md:flex items-center space-x-6 flex-1 justify-center">
          <form @submit.prevent="goToSearch" class="relative w-full max-w-md">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            </span>
            <input
              v-model="query"
              type="text"
              placeholder="Sök..."
              class="pl-10 pr-4 py-2 w-full rounded-md border border-gray-700 bg-gray-800 text-black placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </form>
  
          <!-- Länkar -->
          <NuxtLink to="/" class="text-lg hover:underline">Hem</NuxtLink>
          <NuxtLink to="/me" class="text-lg hover:underline">Mina sidor</NuxtLink>
          <NuxtLink to="/404" class="text-lg hover:underline">Om sidan</NuxtLink>
        </div>
  
        <!-- Login / logout -->
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <button @click="signOut" class="text-xl font-semibold hover:underline">
              Logga ut 
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-xl font-semibold hover:underline">
              Logga in
            </NuxtLink>
          </template>
  
          <!-- Mobilmenyknapp -->
          <DisclosureButton class="md:hidden inline-flex items-center justify-center p-2 text-black-300 hover:text-black hover:bg-gray-800 rounded-md">
            <Bars3Icon v-if="!open" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
            <span class="sr-only">Öppna meny</span>
          </DisclosureButton>
        </div>
      </div>
  
      <!-- Mobilmeny -->
      <DisclosurePanel class="md:hidden border-t border-gray-800 bg-white-900 text-black px-4 pb-4 space-y-3">
        <form @submit.prevent="goToSearch" class="relative mt-3">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </span>
          <input
            v-model="query"
            type="text"
            placeholder="Sök..."
            class="pl-10 pr-4 py-2 w-full rounded-md border border-gray-700 bg-gray-800 text-black placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </form>
  
        <NuxtLink to="/" class="block text-sm hover:underline">Hem</NuxtLink>
        <NuxtLink to="/me" class="block text-sm hover:underline">Mina sidor</NuxtLink>
        <NuxtLink to="/404" class="block text-sm hover:underline">Om sidan</NuxtLink>
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
  