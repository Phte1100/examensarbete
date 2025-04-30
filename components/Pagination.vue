<template>
    <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <!-- Mobil: endast Prev/Next -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Föregående
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Nästa
        </button>
      </div>
  
      <!-- Desktop: sidnummer -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              aria-label="Föregående sida"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
  
            <button
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset',
                page === currentPage
                  ? 'z-10 bg-indigo-600 text-white ring-indigo-600'
                  : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
  
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              aria-label="Nästa sida"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
  
  const props = defineProps({
    currentPage: Number,
    totalPages: Number,
    totalItems: Number,
    perPage: Number
  })
  
  const emit = defineEmits(['update:page'])
  
  const changePage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
      emit('update:page', page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
  const endItem = computed(() =>
    Math.min(props.currentPage * props.perPage, props.totalItems)
  )

  /*
          <div>
          <p class="text-sm text-gray-700">
            Visar
            <span class="font-medium">{{ startItem }}</span>
            till
            <span class="font-medium">{{ endItem }}</span>
            av
            <span class="font-medium">{{ totalItems }}</span>
            resultat
          </p>
        </div>
  */
  </script>
  
  