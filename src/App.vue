<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
</script>

<template>
  <Toast />
  <!-- RouterView là cái "màn hình chiếu", tuỳ theo URL mà nó sẽ chiếu LoginForm hay RegisterForm lên đây -->
  <RouterView />
</template>

<style scoped></style>
