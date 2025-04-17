<script setup>
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'
import { watchEffect } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

watchEffect(async () => {
  if (!user.value) return

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Session error:', error)
    return
  }

  if (data?.session) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, website')
      .eq('id', user.value.id)
      .single()

    if (profileError) {
      console.error('Kunde inte hämta profil:', profileError)
      return
    }

    if (!profile?.username) {
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
