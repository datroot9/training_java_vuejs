<template>
  <div class="screen-list-wrapper">
    <main class="main-content">
      <div class="content-card">
        <header class="header">
          <div class="logo">
            <img src="@/assets/logo.svg" alt="App Logo" width="40" height="40" />
            <h2>My App</h2>
          </div>
          <div class="user-controls">
            <span class="username">Welcome, {{ username }}</span>
            <RouterLink to="/login" style="color: blue;">Logout</RouterLink>
          </div>
        </header> 
        <div class="Searching-student-groups">
          <div class="search-inputs">
            <div class="input-group">
              <label for="search-name">Student Name</label>
              <InputText id="search-name" v-model="searchName" />
            </div>
            <div class="input-group">
              <label for="search-code">Student Code</label>
              <InputText id="search-code" v-model="searchCode"  />
            </div>
            <div class="input-group">
              <label for="search-birthday">Birthday</label>
              <InputText id="search-birthday" v-model="searchBirthday" type="date" />
            </div>
          </div>
          <div class="search-actions">
            <Button @click="handleSearchStudent" label="Search" class="search-btn" unstyled/>
            <Button label="Add Student"  class="add-btn" unstyled/>
          </div>
        </div>

        <DataTable :value="filteredUsers" paginator :rows="10">
          <template #paginatorfirstpagelinkicon unstyled>first</template>
          <template #paginatorprevpagelinkicon unstyled>prev</template>
          <template #paginatornextpagelinkicon unstyled>next</template>
          <template #paginatorlastpagelinkicon unstyled>last</template>
          
          <Column field="No" header="No" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem;">▲</span><span v-else-if="sortOrder === -1" style="font-size: 0.8rem;">▼</span><span v-else style="font-size: 0.8rem; color: #aaa;">▲</span>
            </template>
          </Column>
          <Column field="Code" header="Code" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem;">▲</span><span v-else-if="sortOrder === -1" style="font-size: 0.8rem;">▼</span><span v-else style="font-size: 0.8rem; color: #aaa;">▲</span>
            </template>
          </Column>
          <Column field="name" header="Name" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem;">▲</span><span v-else-if="sortOrder === -1" style="font-size: 0.8rem;">▼</span><span v-else style="font-size: 0.8rem; color: #aaa;">▲</span>
            </template>
          </Column>
          <Column field="Birthday" header="Birthday" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem;">▲</span><span v-else-if="sortOrder === -1" style="font-size: 0.8rem;">▼</span><span v-else style="font-size: 0.8rem; color: #aaa;">▲</span>
            </template>
          </Column>
          <Column field="Address" header="Address" ></Column>
          <Column field="Score" header="Score" sortable>
            <template #sorticon="{ sortOrder }">
              <span v-if="sortOrder === 1" style="font-size: 0.8rem;">▲</span><span v-else-if="sortOrder === -1" style="font-size: 0.8rem;">▼</span><span v-else style="font-size: 0.8rem; color: #aaa;">▲</span>
            </template>
          </Column>
          <Column header="Edit">
            <template #body="{ data }">
              <a href="#" @click.prevent style="margin-right: 15px; color: #1a73e8; text-decoration: none;">edit</a>
              <a href="#" @click.prevent="handleDeleteStudent(data)" style="color: #ea4335; text-decoration: none;">delete</a>
            </template>
          </Column>
        </DataTable>
      </div>
    </main>

    <!-- Beautiful Error Popup -->
    <Dialog v-model:visible="showErrorPopup" modal header="Validation Error" :style="{ width: '25rem' }" :closable="false">
      <div style="padding: 10px 0 20px 0; color: #444; font-size: 1.05rem; display: flex; align-items: center;">
        <i class="pi pi-exclamation-triangle" style="color: #eab308; margin-right: 15px; font-size: 1.5rem;"></i>
        <span style="line-height: 1.4;">{{ errorMessage }}</span>
      </div>
      <div style="display: flex; justify-content: flex-end;">
        <Button label="Got it" @click="showErrorPopup = false" severity="secondary" autofocus />
      </div>
    </Dialog>

    <!-- Confirm Deletion Popup -->
    <Dialog v-model:visible="showDeletePopup" modal header="Confirm Deletion" :style="{ width: '25rem' }" :closable="false">
      <div style="padding: 10px 0 20px 0; color: #444; font-size: 1.05rem; display: flex; align-items: center;">
        <i class="pi pi-info-circle" style="color: #ea4335; margin-right: 15px; font-size: 1.5rem;"></i>
        <span style="line-height: 1.4;">Are you absolutely certain you want to permanently delete the record for <strong>{{ studentToDelete?.name }}</strong>?</span>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <Button label="Cancel" @click="showDeletePopup = false" severity="secondary" outlined />
        <Button label="Delete" @click="confirmDeleteStudent()" severity="danger" autofocus />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Import PrimeVue components explicitly since global components aren't configured yet
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import type { Student } from '../types/student';

const router = useRouter();
const showErrorPopup = ref(false);
const showDeletePopup = ref(false);
const studentToDelete = ref<Student | null>(null); // Securely tracks the specific row data being targeted
const errorMessage = ref(''); // Stores our dynamic validation rejections
const searchName = ref('');
const searchCode = ref('');
const searchBirthday = ref('');

// Dynamically pull the logged in user from local storage! (Fallback to Guest)
const username = ref(localStorage.getItem('loggedInUser') || 'Guest User');

// Mock data for the Data Table strictly bound to the new Student contract
const users = ref<Student[]>([
  { No: 1, Code: 'STU001', name: 'Alice Smith', Birthday: '2002-05-14', Address: '123 Maple St, NY', Score: 8.5 },
  { No: 2, Code: 'STU002', name: 'Bob Jones', Birthday: '2001-11-20', Address: '456 Oak Dr, CA', Score: 7.2 },
  { No: 3, Code: 'STU003', name: 'Charlie Brown', Birthday: '2003-03-10', Address: '789 Pine Ln, TX', Score: 9.1 },
  { No: 4, Code: 'STU004', name: 'Diana Prince', Birthday: '2002-08-25', Address: '321 Elm St, FL', Score: 8.8 },
  { No: 5, Code: 'STU005', name: 'Evan Peters', Birthday: '2001-12-05', Address: '654 Birch Rd, WA', Score: 6.9 },
  { No: 6, Code: 'STU006', name: 'Fiona Gallagher', Birthday: '2003-07-19', Address: '987 Cedar Ct, PA', Score: 9.5 },
  { No: 7, Code: 'STU007', name: 'George Lucas', Birthday: '2002-01-30', Address: '159 Walnut Ave, NV', Score: 8.0 },
  { No: 8, Code: 'STU008', name: 'Hannah Abbott', Birthday: '2001-09-12', Address: '753 Ash Blvd, OR', Score: 7.8 },
  { No: 9, Code: 'STU009', name: 'Ian Malcolm', Birthday: '2003-04-22', Address: '852 Spruce Way, UT', Score: 8.9 },
  { No: 10, Code: 'STU010', name: 'Julia Roberts', Birthday: '2002-06-08', Address: '951 Pearl Sq, AZ', Score: 9.2 },
  { No: 11, Code: 'STU011', name: 'Kevin Hart', Birthday: '2001-02-14', Address: '147 Diamond St, NY', Score: 6.4 },
  { No: 12, Code: 'STU012', name: 'Liam Neeson', Birthday: '2003-10-05', Address: '258 Ruby Ln, TX', Score: 7.5 },
  { No: 13, Code: 'STU013', name: 'Megan Fox', Birthday: '2002-12-25', Address: '369 Sapphire Blvd, CA', Score: 8.1 },
  { No: 14, Code: 'STU014', name: 'Natalie Portman', Birthday: '2001-07-04', Address: '741 Emerald Ave, FL', Score: 9.8 },
  { No: 15, Code: 'STU015', name: 'Oscar Isaac', Birthday: '2003-03-30', Address: '852 Topaz Dr, WA', Score: 7.0 },
  { No: 16, Code: 'STU016', name: 'Penelope Cruz', Birthday: '2002-09-09', Address: '963 Opal Ct, OR', Score: 8.3 },
  { No: 17, Code: 'STU017', name: 'Quentin Tarantino', Birthday: '2001-04-18', Address: '159 Pearl Way, NV', Score: 8.7 },
  { No: 18, Code: 'STU018', name: 'Ryan Reynolds', Birthday: '2003-08-11', Address: '357 Onyx Sq, UT', Score: 6.8 },
  { No: 19, Code: 'STU019', name: 'Scarlett Johansson', Birthday: '2002-01-21', Address: '486 Jade Rd, AZ', Score: 9.4 },
  { No: 20, Code: 'STU020', name: 'Tom Hanks', Birthday: '2001-11-13', Address: '624 Quartz St, PA', Score: 7.9 },
  { No: 21, Code: 'STU021', name: 'Uma Thurman', Birthday: '2003-06-06', Address: '815 Garnet Ln, NY', Score: 8.6 },
  { No: 22, Code: 'STU022', name: 'Vin Diesel', Birthday: '2002-02-28', Address: '739 Amethyst Dr, TX', Score: 7.1 },
  { No: 23, Code: 'STU023', name: 'Will Smith', Birthday: '2001-05-19', Address: '912 Sunstone Ave, CA', Score: 8.2 },
  { No: 24, Code: 'STU024', name: 'Xavier Bardem', Birthday: '2003-12-12', Address: '468 Moonstone Blvd, FL', Score: 9.0 },
  { No: 25, Code: 'STU025', name: 'Zendaya', Birthday: '2002-10-31', Address: '579 Zircon Ct, WA', Score: 9.7 },
]);

// This active array houses the search results bound directly to your DataTable!
const filteredUsers = ref<Student[]>([...users.value]);

const handleSearchStudent = () => {
  const birthdayVal = searchBirthday.value;
  
  // Only trigger our massively strict date validation IF they actually attempted to type a birthday!
  if (birthdayVal) {
    const byteSize = new TextEncoder().encode(birthdayVal).length;
    
    if (byteSize !== 10) {
      errorMessage.value = 'A full 10-byte birthday format (YYYY-MM-DD) is required!';
      showErrorPopup.value = true;
      return;
    }

    const parsedDate = new Date(birthdayVal);
    if (isNaN(parsedDate.getTime())) {
      errorMessage.value = 'The input is not a recognized calendar date!';
      showErrorPopup.value = true;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (parsedDate > today) {
      errorMessage.value = 'A student\'s birthday cannot be set in the future!';
      showErrorPopup.value = true;
      return;
    }

    const maxHistory = new Date();
    maxHistory.setFullYear(today.getFullYear() - 100);
    if (parsedDate < maxHistory) {
      errorMessage.value = 'The birth year entered is suspiciously old. Please verify!';
      showErrorPopup.value = true;
      return;
    }
  }

  // Run the native Javascript array filter across all three conditions simultaneously!
  filteredUsers.value = users.value.filter((student) => {
    // By using toLowerCase(), we ensure typing "alice" matches safely against "Alice Smith"
    const matchName = !searchName.value || student.name.toLowerCase().startsWith(searchName.value.toLowerCase());
    const matchCode = !searchCode.value || student.Code.toLowerCase().startsWith(searchCode.value.toLowerCase());
    
    // If no birthday was entered into the search bar, we automatically skip filtering out by birthday.
    const matchBirthday = !birthdayVal || student.Birthday === birthdayVal;
    
    return matchName && matchCode && matchBirthday;
  });
  
  console.log(`Search complete! Rendered ${filteredUsers.value.length} matching students onto the Datatable.`);
}

const handleDeleteStudent = (student: Student) => {
  // Push the row payload directly into our visual modal and flip the modal boolean physically!
  studentToDelete.value = student;
  showDeletePopup.value = true;
}

const confirmDeleteStudent = () => {
  const targetStudent = studentToDelete.value;
  
  if (targetStudent) {
    // 1. Array filter strictly against the master data payload targeting the student's unique Code!
    users.value = users.value.filter(u => u.Code !== targetStudent.Code);
    
    // 2. Perform the exact same array filter concurrently across the dynamic UI presentation array!
    filteredUsers.value = filteredUsers.value.filter(u => u.Code !== targetStudent.Code);
    
    console.log(`Successfully deleted student: ${targetStudent.Code} - ${targetStudent.name}`);
    
    // Smoothly hide the popup layer and natively deregister the payload mapping object
    showDeletePopup.value = false;
    studentToDelete.value = null;
  }
}
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 25px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eef2f6;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo h2 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  font-weight: 500;
  color: #555;
  font-size: 1rem;
}

.Searching-student-groups {
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 20px;
  margin-bottom: 30px;
}

.search-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
.search-actions button{
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
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
:deep(.p-paginator-content  button){
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