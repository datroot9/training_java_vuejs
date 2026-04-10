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
  background: radial-gradient(1200px 800px at 15% 0%, rgba(16, 185, 129, 0.18) 0%, rgba(255, 255, 255, 0) 55%),
    radial-gradient(1000px 700px at 85% 10%, rgba(52, 211, 153, 0.18) 0%, rgba(255, 255, 255, 0) 60%),
    linear-gradient(180deg, #f0fdf4 0%, #ffffff 45%, #f8fafc 100%);
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
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(16, 185, 129, 0.14);
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.08),
    0 2px 8px rgba(16, 185, 129, 0.08);
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(90deg, #047857, #10b981, #34d399);
}

@media (max-width: 768px) {
  .main-content {
    padding: 18px;
  }

  .content-card {
    padding: 18px;
  }
}
</style>
