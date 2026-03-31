<template>
  <div class="screen-list-wrapper">
    <main class="main-content">
      <div class="content-card">
        <!-- Modularized Header Component -->
        <AppHeader />

        <!-- Modularized Search Form -->
        <StudentSearch
          v-model:name="searchName"
          v-model:code="searchCode"
          v-model:birthday="searchBirthday"
          @search="handleSearchStudent"
          @add="router.push('/student/setup')"
          @export="handleExport"
        />

        <!-- Modularized Student Table -->
        <StudentTable
          :students="students"
          :loading="isLoading"
          :total-count="totalCount"
          :page-size="pageSize"
          :current-page="currentPage"
          :sort-order="currentSortOrder"
          @page="updatePage"
          @sort="onSort"
          @edit="(student) => router.push(`/student/setup/${student.id}`)"
          @delete="handleDeleteStudent"
        />
      </div>
    </main>

    <!-- Beautiful Error Popup -->
    <Dialog
      v-model:visible="showErrorPopup"
      modal
      header="Validation Error"
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
          style="color: #eab308; margin-right: 15px; font-size: 1.5rem"
        ></i>
        <span style="line-height: 1.4">{{ errorMessage }}</span>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <Button
          label="Got it"
          @click="showErrorPopup = false"
          severity="secondary"
          autofocus
        />
      </div>
    </Dialog>

    <!-- Modularized Confirm Deletion Popup -->
    <ConfirmDeleteDialog
      v-model:visible="showDeletePopup"
      :student="studentToDelete"
      @cancel="showDeletePopup = false"
      @confirm="confirmDeleteStudent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { Student } from "../types/student";
import AppHeader from "./AppHeader.vue";
import StudentSearch from "./StudentSearch.vue";
import StudentTable from "./StudentTable.vue";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";
import { useStudents } from "../composables/useStudents";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const showErrorPopup = ref(false);
const showDeletePopup = ref(false);
const studentToDelete = ref<Student | null>(null);
const errorMessage = ref("");
const searchName = ref("");
const searchCode = ref("");
const searchBirthday = ref("");

const {
  students,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  currentSortOrder,
  fetchStudents,
  goToPage,
  deleteStudent,
  exportStudentsData,
} = useStudents();

onMounted(() => {
  fetchStudents(1, 10);
});

const handleSearchStudent = async () => {
  const birthdayVal = searchBirthday.value;

  if (birthdayVal) {
    const byteSize = new TextEncoder().encode(birthdayVal).length;
    if (byteSize !== 10) {
      errorMessage.value = "A full 10-byte birthday format (YYYY-MM-DD) is required!";
      showErrorPopup.value = true;
      return;
    }
  }

  const searchParams = {
    name: searchName.value || undefined,
    code: searchCode.value || undefined,
    birthday: birthdayVal ? birthdayVal.replace(/-/g, '/') : undefined,
  };

  await fetchStudents(1, pageSize.value, searchParams);
};

const handleDeleteStudent = (student: Student) => {
  studentToDelete.value = student;
  showDeletePopup.value = true;
};

const confirmDeleteStudent = async () => {
  const targetStudent = studentToDelete.value;
  if (targetStudent) {
    try {
      await deleteStudent(targetStudent.id);
      showDeletePopup.value = false;
      studentToDelete.value = null;
      toast.add({ severity: 'success', summary: 'Success', detail: 'Student deleted successfully', life: 3000 });
    } catch (err: any) {
      toast.add({ severity: 'error', summary: 'Error', detail: err.message || "Failed to delete student", life: 5000 });
      showDeletePopup.value = false;
    }
  }
};

const handleExport = async () => {
  try {
    await exportStudentsData();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Failed to export CSV";
    showErrorPopup.value = true;
  }
};

const updatePage = (event: any) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  goToPage(newPage);
};

const onSort = (event: any) => {
  const sortBy = event.sortField;
  const sortDirection = event.sortOrder === 1 ? "asc" : "desc";
  fetchStudents(1, pageSize.value, undefined, sortBy, sortDirection);
};
</script>

<style scoped>
.screen-list-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  font-family: Inter, Roboto, sans-serif;
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}
</style>
