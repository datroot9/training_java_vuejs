<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>Login</h1>
      <!-- Đặt novalidate để tắt hoàn toàn bong bóng popup báo lỗi mặc định của HTML5 -->
      <form @submit.prevent="handleLogin" novalidate>
        <!-- Tái chế component CustomInput qua v-for array -->
        <CustomInput
          v-for="field in formFields"
          :key="field.id"
          :id="field.id"
          :modelValue="field.value"
          @update:modelValue="field.update"
          :type="field.type"
          :maxlength="field.maxlength"
          :placeholder="field.placeholder"
          :error="isSubmitted ? field.error : ''"
        >
          <template #icon>
            <component :is="field.icon" class="input-icon" />
          </template>
        </CustomInput>

        <button type="submit" class="login-btn">Login</button>
      </form>
    </div>

    <div class="sign-up-options">
      <p>Don't have an account? <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User as UserIcon, Lock as LockIcon } from 'lucide-vue-next'
import CustomInput from './CustomInput.vue'

const email = ref('')
const password = ref('')
const isSubmitted = ref(false); // Cờ lưu trạng thái đã bấm nút Login

// Mảng cấu hình cho các input field dùng chung
const formFields = computed(() => [
  {
    id: 'email',
    value: email.value,
    update: (val: string) => email.value = val,
    type: 'text',
    maxlength: 20,
    placeholder: 'Enter your email',
    error: emailError.value,
    icon: UserIcon
  },
  {
    id: 'password',
    value: password.value,
    update: (val: string) => password.value = val,
    type: 'password',
    maxlength: 15,
    placeholder: 'Enter your password',
    error: passwordError.value,
    icon: LockIcon
  }
]);

// Validation kiểm tra Email liên tục
const emailError = computed(() => {
  if (!email.value) return 'Email is required';
  
  // check email có chứa ký tự lạ hoặc emoji không
  if (/[^\x00-\xff]/.test(email.value)) {
    return 'Email must not contain multi-byte characters or emojis';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) return 'Invalid email format';
  
  if (email.value.length >= 20) return 'Your email must be less than 20 characters';
  
  return '';
});

// Validation kiểm tra Password liên tục
const passwordError = computed(() => {
  if (!password.value) return 'Password is required';

  // check password có chứa ký tự lạ hoặc emoji không
   if (/[^\x00-\xff]/.test(password.value)) {
     return 'Password must not contain multi-byte characters or emojis';
  }


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

/* Các class css rườm rà của input đã được dọn sang nhà mới CustomInput.vue ^.^ */

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