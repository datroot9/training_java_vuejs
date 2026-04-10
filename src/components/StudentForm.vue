<template>
  <div class="student-form-panel">
    <div class="panel-accent" aria-hidden="true" />

    <div class="form-container">
    <!-- Student Id -->
    <div class="form-row form-field">
      <label :for="ids.id"><i class="pi pi-id-card field-icon" aria-hidden="true" /><span>Student Id</span></label>
      <div class="input-wrapper">
        <InputNumber
          v-model="student.id"
          :inputId="ids.id"
          :useGrouping="false"
          class="short-input"
          disabled
        />
      </div>
    </div>

    <!-- Student Code -->
    <div
      class="form-row form-field"
      :class="{ 'form-field--invalid': !!codeMessage }"
    >
      <label :for="ids.code"><i class="pi pi-barcode field-icon" aria-hidden="true" /><span>Student Code</span></label>
      <div class="input-wrapper">
        <div class="flex-column field-stack">
          <div class="code-wrapper">
            <InputText
              v-model="student.code"
              :id="ids.code"
              :class="['medium-input', { 'p-invalid': !!codeMessage }]"
              :aria-invalid="!!codeMessage"
              :aria-describedby="codeMessage ? ids.codeError : undefined"
              disabled
            />
            <Button
              label="Generate Code"
              icon="pi pi-bolt"
              @click="generateCode"
              class="generate-btn"
              :disabled="isEditMode"
            />
          </div>
          <small
            v-if="codeMessage"
            :id="ids.codeError"
            class="error-text"
            role="alert"
          >{{ codeMessage }}</small>
          <small v-else-if="isCheckingCode" class="checking-text">Checking availability for Student Code…</small>
        </div>
      </div>
    </div>

    <!-- Student Name -->
    <div
      class="form-row form-field"
      :class="{ 'form-field--invalid': !!fieldErrors.name }"
    >
      <label :for="ids.name"><i class="pi pi-user field-icon" aria-hidden="true" /><span>Student Name</span></label>
      <div class="input-wrapper field-stack">
        <InputText
          v-model="student.name"
          :id="ids.name"
          :class="['medium-input', { 'p-invalid': !!fieldErrors.name }]"
          :aria-invalid="!!fieldErrors.name"
          :aria-describedby="fieldErrors.name ? ids.nameError : undefined"
          placeholder="Full name"
        />
        <small
          v-if="fieldErrors.name"
          :id="ids.nameError"
          class="error-text"
          role="alert"
        >{{ fieldErrors.name }}</small>
      </div>
    </div>

    <!-- Birthday -->
    <div
      class="form-row form-field"
      :class="{ 'form-field--invalid': !!fieldErrors.birthday }"
    >
      <label :for="ids.birthday"><i class="pi pi-calendar field-icon" aria-hidden="true" /><span>Birthday</span></label>
      <div class="input-wrapper field-stack">
        <InputText
          type="date"
          v-model="student.birthday"
          :id="ids.birthday"
          class="medium-input date-input"
          :class="{ 'p-invalid': !!fieldErrors.birthday }"
          :aria-invalid="!!fieldErrors.birthday"
          :aria-describedby="fieldErrors.birthday ? ids.birthdayError : undefined"
        />
        <small
          v-if="fieldErrors.birthday"
          :id="ids.birthdayError"
          class="error-text"
          role="alert"
        >{{ fieldErrors.birthday }}</small>
      </div>
    </div>

    <!-- Address -->
    <div
      class="form-row form-field"
      :class="{ 'form-field--invalid': !!fieldErrors.address }"
    >
      <label :for="ids.address"><i class="pi pi-map-marker field-icon" aria-hidden="true" /><span>Address</span></label>
      <div class="input-wrapper field-stack full-width">
        <InputText
          v-model="student.address"
          :id="ids.address"
          class="long-input"
          :class="{ 'p-invalid': !!fieldErrors.address }"
          :aria-invalid="!!fieldErrors.address"
          :aria-describedby="fieldErrors.address ? ids.addressError : undefined"
          placeholder="Street, city, …"
        />
        <small
          v-if="fieldErrors.address"
          :id="ids.addressError"
          class="error-text"
          role="alert"
        >{{ fieldErrors.address }}</small>
      </div>
    </div>

    <!-- Average Score -->
    <div
      class="form-row form-field"
      :class="{ 'form-field--invalid': !!fieldErrors.averageScore }"
    >
      <label :for="ids.scoreInput"><i class="pi pi-chart-line field-icon" aria-hidden="true" /><span>Average Score</span></label>
      <div class="input-wrapper field-stack">
        <InputNumber
          v-model="student.averageScore"
          :inputId="ids.scoreInput"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          :min="0"
          :max="100"
          class="short-input"
          :invalid="!!fieldErrors.averageScore"
          :aria-describedby="fieldErrors.averageScore ? ids.scoreError : undefined"
        />
        <small
          v-if="fieldErrors.averageScore"
          :id="ids.scoreError"
          class="error-text"
          role="alert"
        >{{ fieldErrors.averageScore }}</small>
      </div>
    </div>
    </div>

  <div class="form-actions">
    <Button
      label="Back"
      icon="pi pi-arrow-left"
      outlined
      severity="secondary"
      @click="$emit('back')"
      class="action-btn action-btn--back"
    />
    <Button
      label="Save"
      icon="pi pi-check"
      @click="handleSave"
      class="action-btn action-btn--save"
      :loading="loading"
      :disabled="!!codeError || isCheckingCode"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import type { Student } from '../types/student';
import { useStudents } from '../composables/useStudents';

const student = defineModel<Student>({ required: true });

const props = defineProps<{
  isEditMode: boolean;
  loading: boolean;
}>();

const emit = defineEmits(['save', 'back']);
const { isCodeAvailable } = useStudents();

const ids = {
  id: 'student-field-id',
  code: 'student-field-code',
  codeError: 'student-field-code-error',
  name: 'student-field-name',
  nameError: 'student-field-name-error',
  birthday: 'student-field-birthday',
  birthdayError: 'student-field-birthday-error',
  address: 'student-field-address',
  addressError: 'student-field-address-error',
  scoreInput: 'student-field-score',
  scoreError: 'student-field-score-error'
} as const;

type FieldKey = 'name' | 'birthday' | 'address' | 'averageScore';

const fieldErrors = ref<Record<FieldKey, string>>({
  name: '',
  birthday: '',
  address: '',
  averageScore: ''
});

const codeError = ref('');
/** Set on Save when code is empty; cleared when user generates or edits code */
const codeEmptyError = ref('');
const isCheckingCode = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const codeMessage = computed(() => codeError.value || codeEmptyError.value);

watch(() => student.value.code, (newCode) => {
  if (newCode?.trim()) {
    codeEmptyError.value = '';
  }

  if (props.isEditMode || !newCode) {
    codeError.value = '';
    return;
  }

  isCheckingCode.value = true;
  codeError.value = '';

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      const available = await isCodeAvailable(newCode);
      if (!available) {
        codeError.value = 'Student Code: this code is already used. Generate a new one.';
      }
    } finally {
      isCheckingCode.value = false;
    }
  }, 500);
});

watch(() => student.value.name, () => {
  fieldErrors.value.name = '';
});
watch(() => student.value.birthday, () => {
  fieldErrors.value.birthday = '';
});
watch(() => student.value.address, () => {
  fieldErrors.value.address = '';
});
watch(() => student.value.averageScore, () => {
  fieldErrors.value.averageScore = '';
});

const generateCode = () => {
  student.value.code = 'STU' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

function validateFields(): boolean {
  const s = student.value;

  codeEmptyError.value = s.code?.trim()
    ? ''
    : 'Student Code: enter a code or click “Generate Code”.';

  const nameErr = !s.name?.trim() ? 'Student Name: this field is required.' : '';

  let birthdayErr = '';
  if (!s.birthday?.trim()) {
    birthdayErr = 'Birthday: choose a date.';
  } else if (Number.isNaN(Date.parse(s.birthday))) {
    birthdayErr = 'Birthday: use a valid date.';
  }

  const addressErr = !s.address?.trim() ? 'Address: this field is required.' : '';

  let scoreErr = '';
  const score = s.averageScore;
  if (score === null || score === undefined || Number.isNaN(Number(score))) {
    scoreErr = 'Average Score: enter a number.';
  } else {
    const n = Number(score);
    if (n < 0 || n > 100) {
      scoreErr = 'Average Score: use a value from 0 to 100.';
    }
  }

  fieldErrors.value = {
    name: nameErr,
    birthday: birthdayErr,
    address: addressErr,
    averageScore: scoreErr
  };

  const hasBlockingCode = !!codeError.value || isCheckingCode.value;
  const hasFieldErrors = !!(
    codeEmptyError.value ||
    nameErr ||
    birthdayErr ||
    addressErr ||
    scoreErr
  );

  return !hasFieldErrors && !hasBlockingCode;
}

const handleSave = () => {
  if (isCheckingCode.value || codeError.value) return;

  const ok = validateFields();
  if (!ok) {
    nextTick(() => {
      document.querySelector('.form-field--invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return;
  }
  emit('save');
};
</script>

<style scoped>
.student-form-panel {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
  padding: 2rem 2rem 1.5rem;
  border-radius: 16px;
  background: linear-gradient(165deg, #f8fafc 0%, #ffffff 42%, #f0fdf4 100%);
  border: 1px solid rgba(16, 185, 129, 0.22);
  box-shadow:
    0 4px 6px -1px rgba(16, 185, 129, 0.08),
    0 20px 40px -12px rgba(15, 23, 42, 0.12);
}

.panel-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(90deg, #047857, #10b981, #34d399);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  padding-top: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: minmax(150px, 170px) 1fr;
  align-items: flex-start;
  gap: 1rem 1.25rem;
}

.form-row label {
  padding-top: 0.55rem;
}

.form-field {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.25);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-field:focus-within:not(.form-field--invalid) {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.form-field--invalid {
  border-color: rgba(220, 38, 38, 0.45);
  background: rgba(254, 242, 242, 0.65);
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.12);
}

.form-row label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.field-icon {
  color: #059669;
  font-size: 1rem;
  opacity: 0.95;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.input-wrapper.full-width {
  width: 100%;
}

.field-stack {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  width: 100%;
}

.code-wrapper {
  gap: 0.75rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.flex-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-text {
  color: #b91c1c;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0;
  line-height: 1.35;
}

.checking-text {
  color: #047857;
  font-size: 0.85rem;
  font-style: italic;
}

.short-input,
.medium-input,
.long-input {
  width: 100%;
  max-width: 280px;
}

.long-input {
  max-width: none;
}

.date-input {
  max-width: 220px;
}

:deep(.p-inputnumber.short-input .p-inputtext),
:deep(.medium-input.p-inputtext),
:deep(.long-input.p-inputtext),
:deep(.date-input.p-inputtext) {
  border-radius: 10px;
  min-height: 40px;
  border-color: #cbd5e1;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.p-inputnumber.short-input:not(.p-disabled) .p-inputtext:enabled:focus),
:deep(.medium-input.p-inputtext:enabled:focus),
:deep(.long-input.p-inputtext:enabled:focus),
:deep(.date-input.p-inputtext:enabled:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.22);
}

:deep(.p-inputnumber.short-input.p-disabled .p-inputtext),
:deep(.p-inputnumber.short-input .p-inputtext:disabled) {
  background: #f1f5f9;
  color: #64748b;
}

:deep(.p-inputnumber.p-invalid .p-inputtext) {
  border-color: #dc2626;
}

.generate-btn {
  border-radius: 10px;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%) !important;
  border: 1px solid #34d399 !important;
  color: #047857 !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.18);
}

.generate-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%) !important;
  border-color: #10b981 !important;
}

.generate-btn:disabled {
  opacity: 0.55;
  filter: grayscale(0.2);
}

.form-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin-top: 2.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.action-btn {
  min-width: 140px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.65rem 1.25rem;
}

.action-btn--back {
  border-width: 2px;
  color: #475569;
}

.action-btn--save {
  background: linear-gradient(135deg, #047857 0%, #059669 45%, #10b981 100%) !important;
  border: none !important;
  border-color: transparent !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.38);
}

.action-btn--save:hover:not(:disabled) {
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.45);
}

.action-btn--save:disabled {
  opacity: 0.55;
  filter: grayscale(0.3);
}

@media (max-width: 640px) {
  .student-form-panel {
    padding: 1.5rem 1.1rem 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .form-row label {
    padding-top: 0;
    margin-bottom: -0.25rem;
  }

  .short-input,
  .medium-input {
    max-width: none;
  }

  .date-input {
    max-width: none;
  }
}
</style>
