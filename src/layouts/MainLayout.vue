<template>
  <div class="screen-wrapper">
    <main class="main-content">
      <div class="content-card">
        <AppHeader />
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
</script>

<style scoped>
.screen-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  font-family: Inter, Roboto, sans-serif;
  color: black;
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.content-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}
</style>
