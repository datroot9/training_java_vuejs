<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <div class="input-wrapper">
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button type="submit" class="register-btn">Register</button>
      </form>
    </div>

    <div class="sign-up-options">
      <p>Already have an account? <a :href="href_login">Login</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User as UserIcon, Lock as LockIcon } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const href_login = ref('');

const handleRegister = () => {
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  console.log('Confirm Password:', confirmPassword.value)
  // Add your registration logic here
}
</script>

<style scoped>


.register-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 400px;
}

.register-container {
  width: 100%;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

h1 {
  text-align: left;
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


input {
  width: 100%;
  padding: 16px;
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

.register-btn {
  width: 30%;
  padding: 12px;
  background-color: #575757;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: auto;
  display: block;
}



.sign-up-options {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
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

.sign-up-options a:hover {
  color: #4e8fd8;
}
</style>