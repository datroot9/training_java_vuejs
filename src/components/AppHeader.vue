<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/SMS.png" alt="App Logo" width="40" height="40" />
      <h2>Student Management</h2>
    </div>
    <div class="user-controls">
      <span class="username">Welcome, {{ username }}</span>
      <!-- Restored the local storage purge securely onto the RouterLink exit path! -->
      <RouterLink to="/login" @click="handleLogout" style="color: blue;">Logout</RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AUTH_USER_KEY } from '@/utils/constants';

// Dynamically pull the logged in user from local storage! (Fallback to Guest)
const username = ref(localStorage.getItem(AUTH_USER_KEY) || 'Guest User');

const handleLogout = () => {
  // Completely clear the saved user session securely on logout
  localStorage.removeItem(AUTH_USER_KEY);
};
</script>

<style scoped>
/* Extracted Header Styling */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #eef2f6;
  margin-bottom: 25px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}
</style>
