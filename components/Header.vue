

<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="logo">Learnit</span>
          </NuxtLink>
<div style="align-items: center; justify-content: center; display: flex; margin: auto;">
  <UInput placeholder="Sök..." />
</div>

          <div class="hidden md:block ml-10 space-x-4">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']"
              >{{ item.name }}</NuxtLink
            >
          </div>
        </div>
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink to="/login" class="text-white hover:underline">Logga in/Registrera</NuxtLink>
        </div>
        <div class="-mr-2 flex md:hidden">
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="md:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="NuxtLink"
          :to="item.href"
          :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
        >{{ item.name }}</DisclosureButton>
      </div>
      <div class="border-t border-gray-700 pt-4 pb-3 px-2">
        <NuxtLink to="/login" class="block text-gray-300 hover:text-white mb-2">Logga in/Registrera</NuxtLink>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

/*
const navigation = [
  { name: 'Hem', href: '/', current: true },
  { name: 'Nyheter', href: '/news', current: false },
  { name: 'Om oss', href: '/about', current: false }
]
*/
</script>
