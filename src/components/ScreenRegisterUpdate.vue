<template>
  <MainLayout>
    <h2 class="page-title">STUDENT</h2>
    
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
.page-title {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  margin-top: 10px;
  margin-bottom: 45px;
  font-weight: 400;
}
</style>
