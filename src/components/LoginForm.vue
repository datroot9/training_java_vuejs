<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <div class="input-wrapper">
            <UserIcon class="input-icon" />
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <LockIcon class="input-icon" />
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button type="submit" class="login-btn">Login</button>
      </form>
    </div>

    <div class="sign-up-options">
      <p>Don't have an account? <a :href="href_register" >Register</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User as UserIcon, Lock as LockIcon } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const href_register = ref('');

const handleLogin = () => {
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  // Add your login logic here
}
</script>

<style scoped>


.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 400px;
}

.login-container {
  width: 100%;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: var(--background_color);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
}

input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #4eb3ae;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}



.sign-up-options {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: var(--background_color);
}

.sign-up-options p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.sign-up-options a {
  color: #6baaf8;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}
</style>