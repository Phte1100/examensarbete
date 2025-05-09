<template>
  <!-- app.vue eller layout -->
<NuxtHead>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
</NuxtHead>

    <!-- Innehåll -->

      <Navbar />
      <main>
      <slot />
    </main>
    <Footer />
</template>