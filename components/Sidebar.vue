<template>
    <aside class="p-4 space-y-4 text-sm text-gray-800 sticky top-20 h-fit">

      <nav class="space-y-2">
        <h2 class="font-bold text-lg text-gray-700">Kategorier</h2>
        <ul class="space-y-1">
          <li><NuxtLink to="/" class="hover:underline">Hem</NuxtLink></li>
          <li><NuxtLink to="/me" class="hover:underline">Mina sidor</NuxtLink></li>
          <li><NuxtLink to="/404" class="hover:underline">Om sidan</NuxtLink></li>
          <li><NuxtLink to="/404" class="hover:underline">API:er</NuxtLink></li>
        </ul>
      </nav>
  
      <Filter />
      <h2 class="font-bold text-lg text-gray-700">Mina sökningar</h2>
      <span class="text-xs bg-gray-600 text-white px-2 py-1 rounded-full mb-2 inline-block mr-2">
        Tariffer
      </span>
      <span class="text-xs bg-gray-600 text-white px-2 py-1 rounded-full mb-2 inline-block mr-2">
        Trump
      </span>
      <span class="text-xs bg-gray-600 text-white px-2 py-1 rounded-full mb-2 inline-block">
        Javascript
      </span>
    </aside>
  </template>
  
  <script setup>
  // Inget särskilt just nu
  </script>
  