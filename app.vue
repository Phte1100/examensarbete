<script setup>
import { useSupabaseUser } from '#imports'
const user = useSupabaseUser()
</script>

<template>
<UApp>
<div class="scroll-smooth">
    <Header />
    <NuxtPage />
</div>
</UApp>
</template>

