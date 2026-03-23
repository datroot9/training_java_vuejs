<template>
  <div class="screen-setup-wrapper">
    <main class="main-content">
      <div class="content-card">
        <AppHeader />
        
        <h2 class="page-title">STUDENT</h2>
        
        <div class="form-container">
          <!-- Student Id -->
          <div class="form-row">
            <label>Student Id :</label>
            <div class="input-wrapper">
              <!-- Replaced loose text input with strict native Integer validation -->
              <InputNumber v-model="student.No" inputId="withoutgrouping" :useGrouping="false" class="short-input" disabled/>
            </div>
          </div>
          
          <!-- Student Code -->
          <div class="form-row">
            <label>Student Code :</label>
            <div class="input-wrapper code-wrapper">
              <InputText v-model="student.Code" class="medium-input" />
              <Button label="Generate Code" @click="generateCode" class="generate-btn" />
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
              <InputText type="date" v-model="student.Birthday" class="medium-input date-input" />
            </div>
          </div>

          <!-- Address -->
          <div class="form-row">
            <label>Address :</label>
            <div class="input-wrapper" style="width: 100%;">
              <InputText v-model="student.Address" class="long-input" />
            </div>
          </div>

          <!-- Average Score -->
          <div class="form-row">
            <label>Average Score :</label>
            <div class="input-wrapper">
              <!-- Replaced loose text input with strict architectural Decimal constraint block -->
              <InputNumber v-model="student.Score" :minFractionDigits="0" :maxFractionDigits="2" class="short-input" />
            </div>
          </div>
        </div>

        <!-- Submit Bounds -->
        <div class="form-actions">
          <Button label="Back" @click="handleBack" class="action-btn px-5" />
          <Button label="Save" @click="handleSave" class="action-btn px-5" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './AppHeader.vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { mockStudents } from '../data/mockStudents';
import type { Student } from '../types/student';

// Establish Core System Hooks
const route = useRoute();
const router = useRouter();

// Base Form Payload securely typed against our system Student interface!
const student = ref<Student>({
  No: 0,
  Code: '',
  name: '',
  Birthday: '',
  Address: '',
  Score: 0
});

onMounted(() => {
  // Automatically identify if we are executing "Update" mode naturally by intercepting the unique Route ID parameter!
  const targetCode = route.params.code;
  
  if (targetCode) {
    // Array scan perfectly mapping the internal URL dynamically into our newly extracted Mock Database block
    const existingStudent = mockStudents.find((s: Student) => s.Code === targetCode);
    
    if (existingStudent) {
      console.log('Existing student data physically located. Injecting payload straight into form inputs!');
      // Safely clone the target student object entirely directly into our raw reactive Form state!
      student.value = { ...existingStudent };
    } else {
      console.error('Target student database code not mapped correctly inside the Mock data!');
    }
  }
});

const generateCode = () => {
  // Dynamically assemble a uniquely generated structural Code parameter for new Add entries.
  student.value.Code = 'STU' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

const handleBack = () => {
  router.push('/screens');
};

const handleSave = () => {
  console.log('Securely Saving Student Structure payload:', student.value);
  const targetCode = route.params.code;
  
  if (targetCode) {
    // Find and update existing student
    const index = mockStudents.findIndex((s: Student) => s.Code === targetCode);
    if (index !== -1) {
      mockStudents[index] = { ...student.value };
    }
  } else {
    // Create new student
    student.value.No = Math.max(0, ...mockStudents.map(s => s.No)) + 1;
    if (!student.value.Code) {
      generateCode();
    }
    mockStudents.push({ ...student.value });
  }

  router.push('/screens');
};
</script>

<style scoped>
/* Base Architectural Wrappers Inheriting From ScreenList Global System Configs */
.screen-setup-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
  color: black;
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.content-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}

.page-title {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  margin-top: 10px;
  margin-bottom: 45px;
  font-weight: 400;
}

/* Custom Grid Implementation rigidly mapping to your design bounds constraint by constraint */
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

/* Granular Form Control Metrics Extracted from provided Screenshot */
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
