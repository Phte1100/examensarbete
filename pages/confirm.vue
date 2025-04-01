<script setup>
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()
  console.log('SESSION:', data?.session)

  if (error) {
    console.error('Session error:', error)
  }

  if (data?.session) {
    const { data: profile } = await supabase
  .from('profiles')
  .select('username, website')
  .eq('id', user.value.id)
  .single()

if (!profile?.username || !profile?.website) {
  router.push('/complete-profile')
} else {
  router.push('/')
}

} else {
  router.push('/login')
}

})
</script>

<template>
  <div class="container">
    <h2>Verifierar inloggning...</h2>
  </div>
</template>
