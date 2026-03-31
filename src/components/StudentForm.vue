<template>
  <div class="form-container">
    <!-- Student Id -->
    <div class="form-row">
      <label>Student Id :</label>
      <div class="input-wrapper">
        <InputNumber v-model="student.id" inputId="withoutgrouping" :useGrouping="false" class="short-input" disabled/>
      </div>
    </div>
    
    <!-- Student Code -->
    <div class="form-row">
      <label>Student Code :</label>
      <div class="input-wrapper code-wrapper">
        <InputText v-model="student.code" class="medium-input" :disabled="isEditMode" />
        <Button label="Generate Code" @click="generateCode" class="generate-btn" :disabled="isEditMode" />
      </div>
    </div>

    <!-- Student Name -->
    <div class="form-row">
      <label>Student Name :</label>
      <div class="input-wrapper">
        <InputText v-model="student.name" class="medium-input" />
      </div>
    </div>

    <!-- Birthday -->
    <div class="form-row">
      <label>Birthday :</label>
      <div class="input-wrapper">
        <InputText type="date" v-model="student.birthday" class="medium-input date-input" />
      </div>
    </div>

    <!-- Address -->
    <div class="form-row">
      <label>Address :</label>
      <div class="input-wrapper" style="width: 100%;">
        <InputText v-model="student.address" class="long-input" />
      </div>
    </div>

    <!-- Average Score -->
    <div class="form-row">
      <label>Average Score :</label>
      <div class="input-wrapper">
        <InputNumber v-model="student.averageScore" :minFractionDigits="0" :maxFractionDigits="2" class="short-input" />
      </div>
    </div>
  </div>

  <!-- Submit Bounds -->
  <div class="form-actions">
    <Button label="Back" @click="$emit('back')" class="action-btn px-5" />
    <Button label="Save" @click="$emit('save')" class="action-btn px-5" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import type { Student } from '../types/student';

const student = defineModel<Student>({ required: true });

defineProps<{
  isEditMode: boolean;
  loading: boolean;
}>();

const emit = defineEmits(['save', 'back']);

const generateCode = () => {
  student.value.code = 'STU' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 750px;
  margin: 0 auto;
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 15px;
}

.form-row label {
  text-align: left;
  font-size: 1rem;
  color: #000;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.code-wrapper {
  gap: 20px;
}

.short-input {
  border-radius: 2px;
  border: 1px solid #7d7c7d;
  height: 35px;
}

.medium-input {
  width: 250px;
  border-radius: 2px;
  border: 1px solid #7d7c7d;
  height: 35px;
}

.long-input {
  width: 100%; 
  border-radius: 2px;
  border: 1px solid #7d7c7d;
  height: 35px;
}

.date-input {
  background-color: #fff;
}

.generate-btn {
  background-color: #ededed;
  color: #000;
  border: 1px solid #7d7c7d;
  border-radius: 6px;
  font-size: 1rem;
  padding: 6px 15px;
  font-weight: normal;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 80px;
  margin-bottom: 40px;
}

.action-btn {
  background-color: #ededed;
  color: #000;
  border: 1px solid #7d7c7d;
  border-radius: 6px;
  min-width: 130px;
  font-size: 1.1rem;
  font-weight: normal;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
  padding: 8px;
}
</style>
