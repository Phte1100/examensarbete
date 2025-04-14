<script setup>
import { useSupabaseUser } from '#imports'
const user = useSupabaseUser()
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
