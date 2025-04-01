<script setup>
import { useSupabaseUser } from '#imports'
const user = useSupabaseUser()
</script>

<template>
  <div>
    <Header />
    <NuxtPage />
    <div class="container" style="padding: 50px 0 100px 0">
    <Account v-if="user" />
    <Auth v-else />
    </div>
  </div>
</template>

