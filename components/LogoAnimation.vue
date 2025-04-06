<template>
    <h1 class="text-xl font-bold">
        <transition name="drop" mode="out-in">
            <span :key="currentText">{{ currentText }}</span>
      </transition>
    </h1>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const texts = ['Knowit', 'Learnit']
  const currentText = ref(texts[0])
  let index = 0
  
  onMounted(() => {
    setInterval(() => {
      index = (index + 1) % texts.length
      currentText.value = texts[index]
    }, 3000)
  })
  </script>
  
  <style scoped>
.drop-enter-active, .drop-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.drop-enter-from {
  opacity: 0;
  transform: translateY(-30px); 
}

.drop-leave-to {
  opacity: 0;
  transform: translateY(30px)
}

  h1 {
    font-size: 70px;
    font-family: 'Bagoss Standard';
    text-align: center;
  }
  </style>
  