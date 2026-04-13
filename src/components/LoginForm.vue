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
          :error="field.error"
          :highlight-invalid="!!loginError"
          :server-error-id="loginError ? 'login-api-error' : ''"
        >
          <template #icon>
            <component :is="field.icon" class="input-icon" />
          </template>
        </CustomInput>

        <p
          v-if="loginError"
          id="login-api-error"
          class="login-api-error"
          role="alert"
        >
          {{ loginError }}
        </p>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? "Signing in…" : "Login" }}
        </button>
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
import { ref, computed, watch } from "vue";
import { User as UserIcon, Lock as LockIcon } from "lucide-vue-next";
import CustomInput from "./CustomInput.vue";
import { useRouter } from "vue-router";
import { useValidation } from "@/composables/useValidation";

import { authApi } from "@/api/auth";

const userName = ref("");
const password = ref("");
const isSubmitted = ref(false); // Cờ lưu trạng thái đã bấm nút Login
const isLoading = ref(false);
/** Set when the API rejects login (wrong email/password, etc.) */
const loginError = ref("");
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
    error: isSubmitted.value ? userNameError.value : "",
    icon: UserIcon,
  },
  {
    id: "password",
    value: password.value,
    update: (val: string) => (password.value = val),
    type: "password",
    maxlength: 15,
    placeholder: "Enter your password",
    error: isSubmitted.value ? passwordError.value : "",
    icon: LockIcon,
  },
]);

watch([userName, password], () => {
  loginError.value = "";
});

import { AUTH_USER_KEY, AUTH_ROLE_KEY } from "@/utils/constants";

/** Turns API login errors into plain, supportive copy (no “which field was wrong”). */
function toFriendlyLoginError(raw: unknown): string {
  const msg = typeof raw === "string" ? raw.trim() : "";
  const lower = msg.toLowerCase();

  if (!msg) {
    return "We couldn’t sign you in. Please check your email and password and try again.";
  }

  if (
    lower.includes("invalid email") ||
    lower.includes("invalid password") ||
    lower.includes("invalid credentials") ||
    lower.includes("wrong password") ||
    lower.includes("bad credentials") ||
    lower.includes("incorrect username or password") ||
    lower.includes("incorrect email or password") ||
    lower === "unauthorized"
  ) {
    return "We couldn’t sign you in with those details. Double-check your email and password, then try again.";
  }

  if (
    lower.includes("network") ||
    lower.includes("failed to fetch") ||
    lower.includes("load failed")
  ) {
    return "We couldn’t reach the server. Check your connection and try again.";
  }

  return msg;
}

const handleLogin = async () => {
  loginError.value = "";
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
    localStorage.setItem(AUTH_USER_KEY, data.data.username);
    localStorage.setItem(AUTH_ROLE_KEY, data.data.role ?? "USER");
    router.push("/screens");
  } catch (error: any) {
    console.error("Error during login:", error);
    loginError.value = toFriendlyLoginError(error?.message);
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
  padding: 20px;
  background-image:
    linear-gradient(rgba(6, 78, 59, 0.55), rgba(6, 78, 59, 0.55)),
    url("@/assets/app.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-container {
  width: min(100%, 400px);
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
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

.login-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.login-api-error {
  color: #ff4d4f;
  font-size: 13px;
  font-weight: 600;
  margin: -8px 0 16px;
  padding: 8px 10px;
  border-radius: 4px;
  background: rgba(255, 77, 79, 0.08);
  border: 1px solid rgba(255, 77, 79, 0.25);
}

.sign-up-options {
  text-align: center;
  padding: 10px;
  width: min(100%, 400px);
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
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

@media (max-width: 480px) {
  .login-wrapper {
    padding: 14px;
  }

  .login-container {
    padding: 20px 16px;
  }
}
</style>
