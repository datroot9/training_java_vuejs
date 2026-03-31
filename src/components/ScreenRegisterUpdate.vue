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
              <!-- Replaced loose text input with strict architectural Decimal constraint block -->
              <InputNumber v-model="student.averageScore" :minFractionDigits="0" :maxFractionDigits="2" class="short-input" />
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './AppHeader.vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import type { Student } from '../types/student';
import { useToast } from 'primevue/usetoast';
import { studentApi } from '../api/students';

// Establish Core System Hooks
const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEditMode = computed(() => !!route.params.id);

// Base Form Payload securely typed against our system Student interface!
const student = ref<Student>({
  id: 0,
  code: '',
  name: '',
  birthday: '',
  address: '',
  averageScore: 0
});

onMounted(async () => {
  // Automatically identify if we are executing "Update" mode naturally by intercepting the unique Route ID parameter!
  const targetId = route.params.id;
  
  if (targetId) {
    try {
      console.log('Fetching student details from API...');
      const existingStudent = await studentApi.getStudentById(Number(targetId));
      
      if (existingStudent) {
        console.log('Student data received. Injecting payload into form inputs!');
        // Safely clone the target student object and format the birthday to yyyy-MM-dd for the HTML5 date input
        student.value = { 
          ...existingStudent,
          birthday: existingStudent.birthday ? existingStudent.birthday.replace(/\//g, '-') : ''
        };
      }
    } catch (err: any) {
      console.error('Failed to fetch student:', err);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load student details', life: 5000 });
      router.push('/screens');
    }
  }
});

const generateCode = () => {
  // Dynamically assemble a uniquely generated structural Code parameter for new Add entries.
  student.value.code = 'STU' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

const handleBack = () => {
  router.push('/screens');
};

const handleSave = async () => {
  console.log('Securely Saving Student Structure payload:', student.value);
  const targetId = route.params.id;

  // Prepare payload
  const { id, ...createPayload } = student.value;
  if (!createPayload.code) {
    createPayload.code = 'STU' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }
  
  // The backend strictly validates birthday format as yyyy/MM/dd
  if (createPayload.birthday) {
    createPayload.birthday = createPayload.birthday.replace(/-/g, '/');
  }
  
  try {
    if (targetId) {
      // Update existing student via API
      await studentApi.updateStudent(Number(targetId), createPayload);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Student updated successfully', life: 3000 });
    } else {
      // Create new student via API
      await studentApi.addStudent(createPayload);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Student created successfully', life: 3000 });
    }
    router.push('/screens');
  } catch (err: any) {
    const action = targetId ? 'update' : 'create';
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: err.message || `Failed to ${action} student`, 
      life: 5000 
    });
  }
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
