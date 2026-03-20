<template>
  <div class="form-group">
    <div class="input-wrapper">
      <!-- Nơi chèn icon ở phía trước (UserIcon / LockIcon) -->
      <slot name="icon"></slot>

      <input
        :id="id"
        :value="modelValue"
        @input="onInput"
        :type="inputType"
        :maxlength="maxlength"
        :placeholder="placeholder"
      />

      <!-- Icon Mắt ẩn/hiện chỉ render khi type truyền vào là password -->
      <button
        v-if="type === 'password'"
        type="button"
        class="toggle-password-btn"
        @click="showPassword = !showPassword"
        data-testid="toggle-password"
      >
        <EyeOffIcon v-if="showPassword" class="eye-icon" />
        <EyeIcon v-else class="eye-icon" />
      </button>
    </div>
    
    <!-- Render dòng chữ cảnh báo lỗi nếu prop error được cung cấp -->
    <span v-if="error" class="length-warning">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  maxlength: { type: Number, default: undefined },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)

// Động điều khiển thuộc tính type của thẻ input gốc
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

// Bắn event lên v-model gốc của component cha mỗi khi gõ
const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Định dạng thẻ slot chứa icon bên trái */
:slotted(.input-icon) {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
}

input {
  width: 100%;
  padding: 10px 40px 10px 40px; /* Căn pad cả 2 bên cho cân đối icon */
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

.length-warning {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 6px;
  padding-left: 4px;
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.toggle-password-btn:hover {
  color: #555;
}

.eye-icon {
  width: 20px;
  height: 20px;
}
</style>
