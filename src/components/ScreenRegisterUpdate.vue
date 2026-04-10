<template>
  <MainLayout>
    <header class="page-header">
      <span class="mode-badge" :class="{ 'mode-badge--edit': isEditMode }">
        {{ isEditMode ? 'Edit mode' : 'New student' }}
      </span>
      <h2 class="page-title">{{ isEditMode ? 'Update student' : 'Register student' }}</h2>
      <p class="page-subtitle">
        {{ isEditMode ? 'Review and save changes to this student record.' : 'Fill in the details below to add a student to the system.' }}
      </p>
    </header>

    <StudentForm
      v-model="student"
      :is-edit-mode="isEditMode"
      :loading="isLoading"
      @back="handleBack"
      @save="handleSave"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import StudentForm from './StudentForm.vue';
import type { Student } from '../types/student';
import { useToast } from 'primevue/usetoast';
import { useStudents } from '../composables/useStudents';
import { toBrowserDate, toBackendDate } from '../utils/date';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { getStudentById, addStudent, updateStudent, isLoading } = useStudents();

const isEditMode = computed(() => !!route.params.id);

const student = ref<Student>({
  id: 0,
  code: '',
  name: '',
  birthday: '',
  address: '',
  averageScore: 0
});

onMounted(async () => {
  const targetId = route.params.id;
  if (targetId) {
    try {
      const existingStudent = await getStudentById(Number(targetId));
      if (existingStudent) {
        student.value = { 
          ...existingStudent,
          birthday: toBrowserDate(existingStudent.birthday)
        };
      }
    } catch (err: any) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load student details', life: 5000 });
      router.push('/screens');
    }
  }
});

const handleBack = () => {
  router.push('/screens');
};

const handleSave = async () => {
  const targetId = route.params.id;
  const { id, ...createPayload } = { ...student.value };

  createPayload.birthday = toBackendDate(createPayload.birthday);
  
  try {
    if (targetId) {
      await updateStudent(Number(targetId), createPayload);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Student updated successfully', life: 3000 });
    } else {
      await addStudent(createPayload);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Student created successfully', life: 3000 });
    }
    router.push('/screens');
  } catch (err: any) {
    const action = targetId ? 'update' : 'create';
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || `Failed to ${action} student`, life: 5000 });
  }
};
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem 1.5rem;
}

.mode-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
}

.mode-badge--edit {
  background: linear-gradient(135deg, #047857 0%, #0d9488 100%);
  box-shadow: 0 4px 14px rgba(4, 120, 87, 0.35);
}

.page-title {
  margin: 1rem 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #14532d 0%, #059669 40%, #34d399 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-subtitle {
  margin: 0 auto;
  max-width: 28rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #64748b;
}
</style>
