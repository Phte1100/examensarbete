<script setup>
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'
import { watchEffect } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

watchEffect(async () => {
  if (!user.value) return

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData?.session) {
    console.error('Sessionfel:', sessionError)
    return router.push('/login')
  }

  // Försök hämta profilen
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.value.id)
    .single()

  // Om profilen inte finns (felkod PGRST116), skapa ny rad
  if (profileError?.code === 'PGRST116') {
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.value.id,
        email: user.value.email,
        username: null,
      }
    ])

    if (insertError) {
      console.error('Kunde inte skapa profil:', insertError)
      return
    }

    return router.push('/complete-profile')
  }

  if (profileError) {
    console.error('Kunde inte hämta profil:', profileError)
    return
  }

  // Om användaren inte har username, skicka till komplettering
  if (!profile?.username) {
    router.push('/complete-profile')
  } else {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen text-gray-600">
    <div class="text-center space-y-4">
      <div class="text-sm text-gray-500">Verifierar inloggning...</div>
      <svg class="animate-spin h-6 w-6 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  </div>
</template>
