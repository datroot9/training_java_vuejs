<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister" novalidate>
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

        <div class="button-group">
          <!-- Type button để chặn tự động Submit ngược -->
          <button type="button" class="back-btn" @click="handleBack">Back</button>
          <button type="submit" class="register-btn">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User as UserIcon, Lock as LockIcon } from 'lucide-vue-next'
import CustomInput from './CustomInput.vue'
import { useRouter } from 'vue-router'  
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitted = ref(false);
const router = useRouter();

// Mảng cấu hình cho các input field dùng chung
const formFields = computed(() => [
  {
    id: 'email',
    value: email.value,
    update: (val: string) => email.value = val,
    type: 'text',
    maxlength: 20,
    placeholder: 'Email',
    error: emailError.value,
    icon: UserIcon
  },
  {
    id: 'password',
    value: password.value,
    update: (val: string) => password.value = val,
    type: 'password',
    maxlength: 15,
    placeholder: 'Password',
    error: passwordError.value,
    icon: LockIcon
  },
  {
    id: 'confirmPassword',
    value: confirmPassword.value,
    update: (val: string) => confirmPassword.value = val,
    type: 'password',
    maxlength: 15,
    placeholder: 'Confirm password',
    error: confirmPasswordError.value,
    icon: LockIcon
  }
]);

const emailError = computed(() => {
  if (!email.value) return 'Email is required';
  if (/[^\x00-\xff]/.test(email.value)) return 'Email must not contain multi-byte characters or emojis';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) return 'Invalid email format';
  if (email.value.length >= 20) return 'Your email must be less than 20 characters';
  return '';
});

const passwordError = computed(() => {
  if (!password.value) return 'Password is required';
  if (/[^\x00-\xff]/.test(password.value)) return 'Password must not contain multi-byte characters or emojis';
  if (password.value.length < 6) return 'Your password must be at least 6 characters';
  if (password.value.length >= 15) return 'Your password must be less than 15 characters';
  return '';
});

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return 'Please confirm your password';
  if (confirmPassword.value !== password.value) return 'Passwords do not match';
  return '';
});

const handleRegister = () => {
  isSubmitted.value = true;
  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    return;
  }
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  console.log('Confirm Password:', confirmPassword.value)
  alert('Registration successful!')
}

const handleBack = () => {
  console.log('Navigating back to Login...')
  router.push('/login');
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

/* Các class input rườm rà đã được lược bỏ vì dùng chung CustomInput.vue */

.button-group {
  display: flex;
  justify-content: flex-end; /* Nằm ép sát lề phải màn hình, back nằm bên trái register */
  gap: 12px;
  margin-top: 10px;
}

.register-btn {
  padding: 12px 24px;
  background-color: #575757;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover {
  background-color: #333333;
}

.back-btn {
  padding: 12px 24px;
  background-color: white;
  color: #575757;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background-color: #f0f0f0;
  border-color: #aaa;
}
</style>