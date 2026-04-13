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
        :aria-invalid="isInvalid ? 'true' : undefined"
        :aria-describedby="describedByIds || undefined"
        :class="{ 
          'has-prefix-icon': !!$slots.icon,
          'has-suffix-icon': type === 'password',
          'input-error': isInvalid
        }"
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
    <span v-if="error" :id="`${id}-error`" class="length-warning" role="alert">{{ error }}</span>
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
  error: { type: String, default: '' },
  /** Red border without field text (e.g. shared login failure on both inputs) */
  highlightInvalid: { type: Boolean, default: false },
  /** Extra element id for aria-describedby (e.g. shared server error message) */
  serverErrorId: { type: String, default: '' }
})

const isInvalid = computed(() => !!props.error || props.highlightInvalid)

const describedByIds = computed(() => {
  const parts: string[] = []
  if (props.error) parts.push(`${props.id}-error`)
  if (props.serverErrorId) parts.push(props.serverErrorId)
  return parts.length ? parts.join(' ') : ''
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

input {
  width: 100%;
  padding: 10px 12px; /* Mặc định lề 2 bên thu gọn gọn gàng 12px nếu rỗng tuếch */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input.has-prefix-icon {
  padding-left: 40px; /* Thêm lề trái nếu có slot icon */
}

input.has-suffix-icon {
  padding-right: 40px; /* Thêm lề phải chừa không gian cho Con Mắt nếu type là password */
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

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

input.input-error {
  border-color: #ff4d4f;
}

input.input-error:focus {
  border-color: #ff4d4f;
  box-shadow: 0 0 5px rgba(255, 77, 79, 0.25);
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
