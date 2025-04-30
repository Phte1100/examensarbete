<!-- components/LikeButton.vue -->
<template>
    <button
      class="flex items-center space-x-1 group"
      @click="toggleLike"
      :disabled="loading"
    >
      <span
        class="material-icons transition-colors duration-200"
        :class="liked ? 'text-red-600' : 'text-gray-700 group-hover:text-red-500'"
      >
        favorite
      </span>
      <span class="text-sm text-gray-700">{{ likeCount }}</span>
    </button>
  </template>
  
  <script setup>
  import { ref, watchEffect } from 'vue'
  import { useSupabaseClient, useSupabaseUser } from '#imports'
  
  const props = defineProps({
    articleId: { type: Number, required: true },
    initialLikes: { type: Number, default: 0 },
    initialUserLiked: { type: Boolean, default: false }
  })
  
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const likeCount = ref(props.initialLikes)
  const liked = ref(props.initialUserLiked)
  const loading = ref(false)
  
  const toggleLike = async () => {
    if (!user.value) {
      alert('Du måste vara inloggad för att gilla.')
      return
    }
  
    loading.value = true
    try {
      const res = await $fetch('/api/likes/toggle', {
        method: 'POST',
        body: { newsId: props.articleId },
        headers: {
          authorization: `Bearer ${user.value?.access_token}`
        }
      })
  
      liked.value = res.liked
      likeCount.value += res.liked ? 1 : -1
    } catch (err) {
      console.error('Fel vid toggling av like:', err)
    } finally {
      loading.value = false
    }
  }
  </script>
  