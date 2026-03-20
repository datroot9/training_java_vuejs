import { computed, type Ref } from 'vue'

export function useValidation() {
  const validateUserName = (userName: Ref<string>) => {
    return computed(() => {
      if (!userName.value) return 'User name is required';
      if (/[^\x00-\xff]/.test(userName.value)) return 'User name must not contain multi-byte characters or emojis';
      const userNameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userNameRegex.test(userName.value)) return 'Invalid user name format';
      if (userName.value.length >= 20) return 'Your user name must be less than 20 characters';
      return '';
    })
  }

  const validatePassword = (password: Ref<string>) => {
    return computed(() => {
      if (!password.value) return 'Password is required';
      if (/[^\x00-\xff]/.test(password.value)) return 'Password must not contain multi-byte characters or emojis';
      if (password.value.length < 6) return 'Your password must be at least 6 characters';
      if (password.value.length >= 15) return 'Your password must be less than 15 characters';
      return '';
    })
  }

  const validateConfirmPassword = (password: Ref<string>, confirmPassword: Ref<string>) => {
    return computed(() => {
      if (!confirmPassword.value) return 'Please confirm your password';
      if (confirmPassword.value !== password.value) return 'Passwords do not match';
      return '';
    })
  }

  return {
    validateUserName,
    validatePassword,
    validateConfirmPassword
  }
}
