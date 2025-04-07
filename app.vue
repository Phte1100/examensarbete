<script setup>
import { useSupabaseUser } from '#imports'
const user = useSupabaseUser()
</script>

<template>
<div class="scroll-smooth">
    <Header />
    <NuxtPage />
</div>


</template>

