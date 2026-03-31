<template>
  <div class="screen-list-wrapper">
    <main class="main-content">
      <div class="content-card">
        <!-- Modularized Header Component -->
        <AppHeader />

        <div class="Searching-student-groups">
          <div class="search-inputs">
            <div class="input-group">
              <label for="search-name">Student Name</label>
              <InputText id="search-name" v-model="searchName" />
            </div>
            <div class="input-group">
              <label for="search-code">Student Code</label>
              <InputText id="search-code" v-model="searchCode" />
            </div>
            <div class="input-group">
              <label for="search-birthday">Birthday</label>
              <InputText
                id="search-birthday"
                v-model="searchBirthday"
                type="date"
              />
            </div>
          </div>
          <div class="search-actions">
            <Button
              @click="handleSearchStudent"
              label="Search"
              class="search-btn"
              unstyled
            />
            <Button
              @click="router.push('/student/setup')"
              label="Add Student"
              class="add-btn"
              unstyled
            />
            <Button
              @click="handleExport"
              label="Export"
              class="export-btn"
              unstyled
            />
          </div>
        </div>

        <DataTable
          :value="students"
          :loading="isLoading"
          paginator
          :rows="pageSize"
          :totalRecords="totalCount"
          :first="(currentPage - 1) * pageSize"
          @page="updatePage"
          @sort="onSort"
          lazy
        >
          <template #paginatorfirstpagelinkicon unstyled>first</template>
          <template #paginatorprevpagelinkicon unstyled>prev</template>
          <template #paginatornextpagelinkicon unstyled>next</template>
          <template #paginatorlastpagelinkicon unstyled>last</template>

          <Column sortField="id" header="No" sortable>
            <template #body="slotProps">
              {{ 
                (currentPage - 1) * pageSize + 
                (currentSortOrder === 'desc' 
                  ? (students.length - slotProps.index) 
                  : (slotProps.index + 1))
              }}
            </template>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span>
              <span v-else-if="sortOrder === -1" style="font-size: 0.8rem">▼</span>
              <span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
            </template>
          </Column>
          <Column field="code" header="Code" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
              ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
                >▼</span
              ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
            </template>
          </Column>
          <Column field="name" header="Name" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
              ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
                >▼</span
              ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
            </template>
          </Column>
          <Column field="birthday" header="Birthday" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
              ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
                >▼</span
              ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
            </template>
          </Column>
          <Column field="address" header="Address"></Column>
          <Column field="averageScore" header="Score" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
              ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
                >▼</span
              ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
            </template>
          </Column>
          <Column header="Edit">
            <template #body="{ data }">
              <!-- Dynamically inject the specific student code into the router path to seamlessly trigger Setup Update mode! -->
              <a
                href="#"
                @click.prevent="router.push(`/student/setup/${data.id}`)"
                style="
                  margin-right: 15px;
                  color: #1a73e8;
                  text-decoration: none;
                "
                >edit</a
              >
              <a
                href="#"
                @click.prevent="handleDeleteStudent(data)"
                style="color: #ea4335; text-decoration: none"
                >delete</a
              >
            </template>
          </Column>
        </DataTable>
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
    <!-- Confirm Deletion Popup -->
    <Dialog
      v-model:visible="showDeletePopup"
      modal
      header="Confirm Deletion"
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
          class="pi pi-info-circle"
          style="color: #ea4335; margin-right: 15px; font-size: 1.5rem"
        ></i>
        <span style="line-height: 1.4"
          >Are you absolutely certain you want to permanently delete the record
          for <strong>{{ studentToDelete?.name }}</strong
          >?</span
        >
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px">
        <Button
          label="Cancel"
          @click="showDeletePopup = false"
          severity="secondary"
          outlined
        />
        <Button
          label="Delete"
          @click="confirmDeleteStudent()"
          severity="danger"
          autofocus
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// Import PrimeVue components explicitly since global components aren't configured yet
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import type { Student } from "../types/student";
import AppHeader from "./AppHeader.vue";
import { useStudents } from "../composables/useStudents";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const showErrorPopup = ref(false);
const showDeletePopup = ref(false);
const studentToDelete = ref<Student | null>(null); // Securely tracks the specific row data being targeted
const errorMessage = ref(""); // Stores our dynamic validation rejections
const searchName = ref("");
const searchCode = ref("");
const searchBirthday = ref("");

// Use the composable to manage student data
const {
  students,
  totalCount,
  totalPages,
  currentPage,
  pageSize,
  isLoading,
  error,
  currentSearchParams,
  currentSortBy,
  currentSortOrder,
  fetchStudents,
  goToPage,
  deleteStudent,
  exportStudentsData,
} = useStudents();

// Load initial student data when component mounts
onMounted(() => {
  console.log("🚀 Component mounted, loading initial data...");
  fetchStudents(1, 10);
});

const handleSearchStudent = async () => {
  const birthdayVal = searchBirthday.value;

  // Only trigger our massively strict date validation IF they actually attempted to type a birthday!
  if (birthdayVal) {
    const byteSize = new TextEncoder().encode(birthdayVal).length;

    if (byteSize !== 10) {
      errorMessage.value =
        "A full 10-byte birthday format (YYYY-MM-DD) is required!";
      showErrorPopup.value = true;
      return;
    }

    const parsedDate = new Date(birthdayVal);
    if (isNaN(parsedDate.getTime())) {
      errorMessage.value = "The input is not a recognized calendar date!";
      showErrorPopup.value = true;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate > today) {
      errorMessage.value = "A student's birthday cannot be set in the future!";
      showErrorPopup.value = true;
      return;
    }

    const maxHistory = new Date();
    maxHistory.setFullYear(today.getFullYear() - 100);
    if (parsedDate < maxHistory) {
      errorMessage.value =
        "The birth year entered is suspiciously old. Please verify!";
      showErrorPopup.value = true;
      return;
    }
  }

  // Build search payload from input values
  const searchParams = {
    name: searchName.value || undefined,
    code: searchCode.value || undefined,
    birthday: birthdayVal ? birthdayVal.replace(/-/g, '/') : undefined,
  };

  console.log("🔍 Search params:", searchParams);
  // Call API with search criteria
  await fetchStudents(1, pageSize.value, searchParams);
};

const handleDeleteStudent = (student: Student) => {
  // Push the row payload directly into our visual modal and flip the modal boolean physically!
  studentToDelete.value = student;
  showDeletePopup.value = true;
};

const confirmDeleteStudent = async () => {
  const targetStudent = studentToDelete.value;

  if (targetStudent) {
    try {
      // Call the API to delete the student
      await deleteStudent(targetStudent.id);

      console.log(
        `✅ Successfully deleted student: ${targetStudent.code} - ${targetStudent.name}`,
      );

      // Smoothly hide the popup layer and natively deregister the payload mapping object
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
    // Await natively managed blob transmission completely without user redirects
    await exportStudentsData();
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : "Failed to export CSV output from server";
    showErrorPopup.value = true;
  }
};

const updatePage = (event: any) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  console.log("📄 Page changed to:", newPage);
  goToPage(newPage);
};

const onSort = (event: any) => {
  const sortBy = event.sortField;
  const sortDirection = event.sortOrder === 1 ? "asc" : "desc";
  console.log(`🔃 Sorting changed to: ${sortBy} ${sortDirection}`);
  // Reset to first page when sorting changes
  fetchStudents(1, pageSize.value, currentSearchParams.value, sortBy, sortDirection);
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

.Searching-student-groups {
  display: flex;
  justify-content: center; /* Lock the groups cleanly to the horizontal center */
  align-items: stretch;
  gap: 40px; /* Expand the gap slightly since they are centrally packed */
  margin-bottom: 25px;
}

.search-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 400px; /* Give the inputs a structured visual width instead of bleeding 100% space */
}

.input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.input-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
  min-width: 120px;
}

.search-inputs :deep(.p-inputtext) {
  width: 100%;
  max-width: 400px;
}

.search-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 15px;
  min-width: 150px;
}
.search-actions button {
  background-color: #f5f5f5;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  border: 1px solid #555;
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: stretch; /* Forces card to actively fill all remaining screen space */
}

.content-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column; /* Enables dynamic vertical filling */
}

.content-card h3 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  font-size: 1.5rem;
}

/* Make DataTable look more premium */
:deep(.p-datatable-thead > tr > th) {
  background-color: #cccdcd; /* Soft grey background */
  padding: 12px 16px;
  border: 1px solid #7d7c7d;
}
:deep(.p-datatable-tbody > tr > td) {
  background-color: #ffffff; /* Soft grey background */
  padding: 12px 16px;
  border: 1px solid #7d7c7d;
}

:deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background-color: #f4f6f8; /* Distinct soft grey for even rows */
}

:deep(.p-datatable-column-header-content) {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  gap: 8px;
  font-weight: 600;
  color: #555; /* Dark grey text */
}
:deep(.p-paginator-content button) {
  display: block;
  background-color: #cccdcd;
  border-radius: 5px;
  color: black;
  border: 1px solid #555;
}

/* Keeps the active page NUMBER permanently yellow */
:deep(.p-paginator-content button.p-paginator-page[data-p-highlight="true"]),
:deep(.p-paginator-content button.p-paginator-page.p-highlight),
:deep(.p-paginator-content button.p-paginator-page.p-paginator-page-selected) {
  background-color: #fef874;
}

/* Other buttons (first, prev, next, last) only turn yellow during the exact moment of the physical click */
:deep(.p-paginator-content button:active) {
  background-color: #fef874 !important;
}

/* Transform the DataTable to dynamically fill the stretched content card */
:deep(.p-datatable) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.p-datatable-table-container) {
  flex: 1; /* Pushes the paginator exactly to the bottom edge of the dynamic card bounds */
}

/* Creates a gap between the number buttons (1, 2, 3...) and the prev/next buttons! */
:deep(.p-paginator .p-paginator-pages) {
  margin: 0 28px;
}
</style>
