<template>
  <button
    @click="handleBookmark"
    class="text-sm flex items-center space-x-1"
    :disabled="loading"
  >
    <span
      class="material-icons transition-colors"
      :class="isBookmarked ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'"
    >
      bookmark
    </span>
    <span v-if="isBookmarked" class="text-blue-500"></span>
    <span v-else class="text-gray-500"></span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isBookmarked = ref(false)
const savedId = ref(null)
const loading = ref(false)


onMounted(async () => {
  if (!user.value) return

  // Kolla om artikeln redan är bokmärkt
  const { data, error } = await supabase
    .from('saved_articles')
    .select('id')
    .eq('user_id', user.value.id)
    .eq('url', props.article.url)
    .maybeSingle()

  if (data) {
    isBookmarked.value = true
    savedId.value = data.id
  }
})

// Hantera bokmärkning
const handleBookmark = async () => {
  if (!user.value) {
    alert('Du måste vara inloggad för att spara artiklar.')
    return
  }

  loading.value = true

  if (isBookmarked.value) {
    // Ta bort bokmärke
    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('id', savedId.value)

    if (error) {
      console.error('Kunde inte ta bort bokmärke:', error)
    } else {
      isBookmarked.value = false
      savedId.value = null
      console.log('Bokmärke borttaget')
    }
  } else {
    //Spara nytt bokmärke
    const { title, url, img_url, url_to_image, published_at, published_date, source_name, source } = props.article

    const { data, error } = await supabase.from('saved_articles').insert([{
      user_id: user.value.id,
      title,
      url,
      img_url: img_url || url_to_image,
      published_at: published_at || published_date,
      source: source_name || source || 'Unknown'
    }]).select().single()

    if (error) {
      console.error('Kunde inte spara artikel:', error)
    } else {
      isBookmarked.value = true
      savedId.value = data.id
      console.log('Artikel sparad!')
    }
  }

  loading.value = false
}
</script>
