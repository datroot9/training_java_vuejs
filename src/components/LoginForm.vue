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
              maxlength="20"
              placeholder="Enter your email"
            />
          </div>
          <span v-if="isSubmitted && emailError" class="length-warning">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <div class="input-wrapper">
            <LockIcon class="input-icon" />
            <input
              id="password"
              v-model="password"
              type="password"
              maxlength="15"
              placeholder="Enter your password"
            />
          </div>
          <span v-if="isSubmitted && passwordError" class="length-warning">{{ passwordError }}</span>
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
import { ref, computed } from 'vue'
import { User as UserIcon, Lock as LockIcon } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const href_register = ref('');
const isSubmitted = ref(false); // Cờ lưu trạng thái đã bấm nút Login

// Validation kiểm tra Email liên tục
const emailError = computed(() => {
  if (!email.value) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) return 'Invalid email format';
  
  if (email.value.length >= 20) return 'Your email must be less than 20 characters';
  
  return '';
});

// Validation kiểm tra Password liên tục
const passwordError = computed(() => {
  if (!password.value) return 'Password is required';
  
  if (password.value.length < 6) return 'Your password must be at least 6 characters';
  
  if (password.value.length >= 15) return 'Your password must be less than 15 characters';
  
  return '';
});

const handleLogin = () => {
  isSubmitted.value = true; // Bật cờ đã submit để hiển thị thông báo lỗi (nếu có)
  
  // Dừng lại nếu emailError hoặc passwordError có chứa thông báo lỗi (không phải là chuỗi rỗng '')
  if (emailError.value || passwordError.value) {
    return;
  }

  console.log('Email:', email.value)
  console.log('Password:', password.value)
  // Demo login
  alert('Login successful! Welcome back.')
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

.length-warning {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 6px;
  padding-left: 4px;
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