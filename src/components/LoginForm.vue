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
      <p>
        Don't have an account? <RouterLink to="/register">Register</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { User as UserIcon, Lock as LockIcon } from "lucide-vue-next";
import CustomInput from "./CustomInput.vue";
import { useRouter } from "vue-router";
import { useValidation } from "@/composables/useValidation";

import { authApi } from "@/api/auth";

const userName = ref("");
const password = ref("");
const isSubmitted = ref(false); // Cờ lưu trạng thái đã bấm nút Login
const isLoading = ref(false);
const router = useRouter();

const { validateUserName, validatePassword } = useValidation();
const userNameError = validateUserName(userName);
const passwordError = validatePassword(password);

// Mảng cấu hình cho các input field dùng chung
const formFields = computed(() => [
  {
    id: "user_name",
    value: userName.value,
    update: (val: string) => (userName.value = val),
    type: "text",
    maxlength: 20,
    placeholder: "Email address",
    error: userNameError.value,
    icon: UserIcon,
  },
  {
    id: "password",
    value: password.value,
    update: (val: string) => (password.value = val),
    type: "password",
    maxlength: 15,
    placeholder: "Enter your password",
    error: passwordError.value,
    icon: LockIcon,
  },
]);

const handleLogin = async () => {
  isSubmitted.value = true; // Bật cờ đã submit để hiển thị thông báo lỗi (nếu có)

  if (userNameError.value || passwordError.value) {
    return; // Block không cho in ra console nếu đang có lỗi
  }

  isLoading.value = true;
  try {
    const data = await authApi.login({
      username: userName.value,
      password: password.value,
    });

    console.log("Login successful:", data);
    // Store the active username globally in localStorage so it persists!
    localStorage.setItem("loggedInUser", userName.value);
    router.push("/screens");
  } catch (error: any) {
    console.error("Error during login:", error);
    alert(error.message || "Login failed. Please check your credentials and try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 10px;
  width: 100%;
}

.login-container {
  width: 400px;
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
  width: 400px;
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
