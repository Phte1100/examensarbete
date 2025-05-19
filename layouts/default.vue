<template>
  <NuxtHead>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  </NuxtHead>

  <Navbar />

  <!-- Gör main till min-h-screen, inte innehållet i sidorna -->
  <main class="min-h-screen">
    <slot />
  </main>

  <Footer />
</template>
