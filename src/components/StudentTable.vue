<template>
  <DataTable
    :value="students"
    :loading="loading"
    paginator
    :rows="pageSize"
    :totalRecords="totalCount"
    :first="(currentPage - 1) * pageSize"
    @page="$emit('page', $event)"
    @sort="$emit('sort', $event)"
    lazy
  >
    <template #paginatorfirstpagelinkicon unstyled>first</template>
    <template #paginatorprevpagelinkicon unstyled>prev</template>
    <template #paginatornextpagelinkicon unstyled>next</template>
    <template #paginatorlastpagelinkicon unstyled>last</template>

    <!-- No Column -->
    <Column sortField="id" header="No" sortable>
      <template #body="slotProps">
        {{ 
          sortOrder === 'desc' 
            ? (students.length - slotProps.index) 
            : (slotProps.index + 1)
        }}
      </template>
      <template #sorticon="{ sortOrder }">
        <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span>
        <span v-else-if="sortOrder === -1" style="font-size: 0.8rem">▼</span>
        <span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
      </template>
    </Column>

    <!-- Other Columns -->
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
    
    <!-- Actions Column -->
    <Column header="Edit">
      <template #body="{ data }">
        <a
          href="#"
          @click.prevent="$emit('edit', data)"
          style="
            margin-right: 15px;
            color: #1a73e8;
            text-decoration: none;
          "
          >edit</a
        >
        <a
          href="#"
          @click.prevent="$emit('delete', data)"
          style="color: #ea4335; text-decoration: none"
          >delete</a
        >
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import type { Student } from "../types/student";

defineProps<{
  students: Student[];
  loading: boolean;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  sortOrder?: 'asc' | 'desc';
}>();

defineEmits(['page', 'sort', 'edit', 'delete']);
</script>

<style scoped>
/* These styles keep the DataTable look and feel consistent with original UI requirements */
:deep(.p-datatable-thead > tr > th) {
  background-color: #cccdcd;
  padding: 12px 16px;
  border: 1px solid #7d7c7d;
}
:deep(.p-datatable-tbody > tr > td) {
  background-color: #ffffff;
  padding: 12px 16px;
  border: 1px solid #7d7c7d;
}

:deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background-color: #f4f6f8;
}

:deep(.p-datatable-column-header-content) {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  gap: 8px;
  font-weight: 600;
  color: #555;
}

:deep(.p-paginator-content button) {
  display: block;
  background-color: #cccdcd;
  border-radius: 5px;
  color: black;
  border: 1px solid #555;
}

:deep(.p-paginator-content button.p-paginator-page[data-p-highlight="true"]),
:deep(.p-paginator-content button.p-paginator-page.p-highlight),
:deep(.p-paginator-content button.p-paginator-page.p-paginator-page-selected) {
  background-color: #fef874;
}

:deep(.p-paginator-content button:active) {
  background-color: #fef874 !important;
}

:deep(.p-datatable) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.p-datatable-table-container) {
  flex: 1;
}

:deep(.p-paginator .p-paginator-pages) {
  margin: 0 28px;
}
</style>
