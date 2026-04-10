<template>
  <div class="table-shell">
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
    <Column header="Actions">
      <template #body="{ data }">
        <a
          href="#"
          @click.prevent="$emit('edit', data)"
          class="action-link action-link--edit"
          aria-label="Edit student"
          title="Edit student"
          ><i class="pi pi-pen-to-square" aria-hidden="true"></i></a
        >
        <a
          href="#"
          @click.prevent="$emit('delete', data)"
          class="action-link action-link--delete"
          aria-label="Delete student"
          title="Delete student"
          ><i class="pi pi-trash" aria-hidden="true"></i></a
        >
      </template>
    </Column>
    </DataTable>
  </div>
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
:deep(.p-datatable) {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow:
    0 6px 18px rgba(2, 6, 23, 0.07),
    0 2px 8px rgba(16, 185, 129, 0.08);
}

.table-shell {
  position: relative;
  margin-top: 10px;
}

.table-shell::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  z-index: 2;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(90deg, #047857, #10b981, #34d399);
}

:deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(180deg, #ecfdf5 0%, #dcfce7 100%);
  padding: 13px 16px;
  border: 1px solid #a7f3d0;
}

:deep(.p-datatable-tbody > tr > td) {
  background-color: #ffffff;
  padding: 13px 16px;
  border: 1px solid #d1fae5;
  color: #0f172a;
}

:deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background-color: #f8fffb;
}

:deep(.p-datatable-tbody > tr:hover > td) {
  background-color: #ecfdf5;
}

:deep(.p-datatable-column-header-content) {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  gap: 8px;
  font-weight: 700;
  color: #065f46;
}

:deep(.p-sortable-column:hover .p-datatable-column-header-content) {
  color: #047857;
}

:deep(.p-paginator-content button) {
  display: block;
  background-color: #ffffff;
  border-radius: 9px;
  color: #065f46;
  border: 1px solid #a7f3d0;
  min-width: 36px;
  height: 36px;
  font-weight: 600;
  transition: all 0.15s ease;
}

:deep(.p-paginator-content button.p-paginator-page[data-p-highlight="true"]),
:deep(.p-paginator-content button.p-paginator-page.p-highlight),
:deep(.p-paginator-content button.p-paginator-page.p-paginator-page-selected) {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-color: #059669;
  color: #ffffff;
}

:deep(.p-paginator-content button:active) {
  transform: scale(0.98);
}

:deep(.p-paginator-content button:hover:not(.p-disabled)) {
  border-color: #34d399;
  background-color: #ecfdf5;
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

.action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.84rem;
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.action-link i {
  font-size: 0.9rem;
  line-height: 1;
}

.action-link + .action-link {
  margin-left: 10px;
}

.action-link--edit {
  color: #065f46;
  border-color: #6ee7b7;
  background-color: #ecfdf5;
}

.action-link--edit:hover {
  background-color: #d1fae5;
  border-color: #34d399;
}

.action-link--delete {
  color: #b91c1c;
  border-color: #fca5a5;
  background-color: #fff1f2;
}

.action-link--delete:hover {
  background-color: #ffe4e6;
  border-color: #fb7185;
}
</style>
