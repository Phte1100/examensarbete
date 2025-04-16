export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()
  
    const publicPages = ['/login', '/register']
  
    // Tillåt offentliga sidor även om användaren inte är inloggad
    if (publicPages.includes(to.path)) {
      return
    }
  
    // Om inte inloggad → skicka till /login
    if (!user.value) {
      return navigateTo('/login')
    }
  })
  