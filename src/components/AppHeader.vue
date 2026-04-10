<template>
  <header class="header">
    <div class="logo">
      <div class="logo-mark" aria-hidden="true">
        <img src="@/assets/SMS.png" alt="" width="36" height="36" />
      </div>
      <div class="brand">
        <h2 class="brand-title">Student Management</h2>
        <span class="brand-subtitle">Safe • Clean • Fast</span>
      </div>
    </div>
    <div class="user-controls">
      <span class="username">Welcome, <strong>{{ username }}</strong></span>
      <!-- Restored the local storage purge securely onto the RouterLink exit path! -->
      <RouterLink
        to="/login"
        @click="handleLogout"
        class="logout-link"
        aria-label="Logout"
        title="Logout"
      >
        <i class="pi pi-sign-out" aria-hidden="true"></i>
      </RouterLink>
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
  localStorage.removeItem('token');
};
</script>

<style scoped>
/* Extracted Header Styling */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px 20px;
  border-bottom: 2px solid rgba(16, 185, 129, 0.14);
  margin-bottom: 25px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(52, 211, 153, 0.18) 100%);
  border: 1px solid rgba(16, 185, 129, 0.18);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.14);
  overflow: hidden;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.1;
}

.brand-title {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #14532d 0%, #059669 45%, #34d399 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  font-size: 1rem;
  color: #0f172a;
  font-weight: 600;
  background: rgba(236, 253, 245, 0.85);
  border: 1px solid rgba(16, 185, 129, 0.18);
  padding: 8px 12px;
  border-radius: 999px;
}

.username strong {
  font-weight: 800;
  color: #047857;
}

.logout-link {
  text-decoration: none;
  font-weight: 700;
  color: #b91c1c;
  background: #ffffff;
  border: 2px solid rgba(239, 68, 68, 0.45);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.16);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.logout-link i {
  font-size: 1rem;
}

.logout-link:hover {
  transform: translateY(-1px);
  border-color: rgba(239, 68, 68, 0.75);
  box-shadow: 0 10px 22px rgba(239, 68, 68, 0.24);
  background: #fff1f2;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .user-controls {
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
