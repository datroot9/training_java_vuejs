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
        />

        <div class="button-group">
          <!-- Type button để chặn tự động Submit ngược -->
          <button type="button" class="back-btn" @click="handleBack">
            Back
          </button>
          <button type="submit" class="register-btn">Register</button>
        </div>
      </form>
    </div>

    <!-- Success Dialog -->
    <Dialog
      v-model:visible="showSuccessDialog"
      modal
      header="Success!"
      :style="{ width: '25rem' }"
      :closable="false"
    >
      <div
        style="
          padding: 10px 0 20px 0;
          color: #444;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
        "
      >
        <i
          class="pi pi-check-circle"
          style="color: #22c55e; margin-right: 15px; font-size: 1.5rem"
        ></i>
        <span style="line-height: 1.4">Account created successfully!</span>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <Button
          label="Back to Login"
          @click="goToLogin"
          severity="success"
          autofocus
        />
      </div>
    </Dialog>

    <!-- Error Dialog -->
    <Dialog
      v-model:visible="showErrorDialog"
      modal
      header="Registration Error"
      :style="{ width: '25rem' }"
      :closable="false"
    >
      <div
        style="
          padding: 10px 0 20px 0;
          color: #444;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
        "
      >
        <i
          class="pi pi-exclamation-triangle"
          style="color: #ef4444; margin-right: 15px; font-size: 1.5rem"
        ></i>
        <span style="line-height: 1.4">{{ errorMessage }}</span>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <Button
          label="Got it"
          @click="showErrorDialog = false"
          severity="secondary"
          autofocus
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CustomInput from "./CustomInput.vue";
import { useRouter } from "vue-router";
import { useValidation } from "@/composables/useValidation";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

import { authApi } from "@/api/auth";

const userName = ref("");
const password = ref("");
const confirmPassword = ref("");
const isSubmitted = ref(false);
const router = useRouter();
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref("");

const { validateUserName, validatePassword, validateConfirmPassword } =
  useValidation();
const userNameError = validateUserName(userName);
const passwordError = validatePassword(password);
const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

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
  },
  {
    id: "password",
    value: password.value,
    update: (val: string) => (password.value = val),
    type: "password",
    maxlength: 15,
    placeholder: "Password",
    error: passwordError.value,
  },
  {
    id: "confirmPassword",
    value: confirmPassword.value,
    update: (val: string) => (confirmPassword.value = val),
    type: "password",
    maxlength: 15,
    placeholder: "Confirm password",
    error: confirmPasswordError.value,
  },
]);

const handleRegister = async () => {
  isSubmitted.value = true;
  if (
    userNameError.value ||
    passwordError.value ||
    confirmPasswordError.value
  ) {
    return;
  }

  try {
    const result = await authApi.register({
      username: userName.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    console.log("Registration successful:", result);
    showSuccessDialog.value = true;
  } catch (error: any) {
    console.error("Registration error:", error);
    errorMessage.value = error.message || "An error occurred during registration";
    showErrorDialog.value = true;
  }
};

const goToLogin = () => {
  showSuccessDialog.value = false;
  router.push("/login");
};

const handleBack = () => {
  console.log("Navigating back to Login...");
  router.push("/login");
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 10px;
  width: 100%;
}

.register-container {
  width: 400px;
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
