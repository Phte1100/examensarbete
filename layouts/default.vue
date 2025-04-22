<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <!-- Bakgrundsbild -->
    <div
  class="absolute inset-0 -z-20 bg-cover bg-center bg-fixed"
  style="background-image: url('/img/bg1.png')"
></div>


    <!-- Blur-lager -->
    <div class="absolute inset-0 backdrop-blur-md bg-white/30 -z-10"></div>

    <!-- Innehåll -->
    <div class="relative z-10">
      <Header />
      <UBreadcrumb />
      <slot />
    </div>
  </div>
</template>
