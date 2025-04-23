<template>
    <aside class="p-4 space-y-4 text-sm text-gray-800 sticky top-20 h-fit">

      <nav class="space-y-2">
        <h2 class="font-bold text-lg text-gray-700">Kategorier</h2>
        <ul class="space-y-1">
          <li><NuxtLink to="/" class="hover:underline">Hem</NuxtLink></li>
          <li><NuxtLink to="/404" class="hover:underline">Mina sidor</NuxtLink></li>
          <li><NuxtLink to="/404" class="hover:underline">Nyheter</NuxtLink></li>
          <li><NuxtLink to="/404" class="hover:underline">Trådar</NuxtLink></li>
          <li><NuxtLink to="/404" class="hover:underline">Hacker News</NuxtLink></li>
        </ul>
      </nav>
  
      <Filter />
      <h2 class="font-bold text-lg text-gray-700">Mina sökningar</h2>
    </aside>
  </template>
  
  <script setup>
  // Inget särskilt just nu
  </script>
  