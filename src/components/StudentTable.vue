<template>
  <div class="table-shell">
    <DataTable
      :value="students"
      :loading="loading"
      paginator
      :rows="pageSize"
      :rowsPerPageOptions="[5, 10, 20]"
      :totalRecords="totalCount"
      :first="(currentPage - 1) * pageSize"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="{first} - {last} of {totalRecords}"
      @page="$emit('page', $event)"
      @sort="$emit('sort', $event)"
      lazy
    >
    <template #header>
      <div class="table-caption">
        <div class="caption-title-wrap">
          <i class="pi pi-users caption-icon" aria-hidden="true"></i>
          <div>
            <h3 class="caption-title">Students</h3>
            <p class="caption-subtitle">Manage and review student records quickly.</p>
          </div>
        </div>
        <span class="caption-total">{{ totalCount }} total</span>
      </div>
    </template>

    <template #paginatorfirstpagelinkicon unstyled>first</template>
    <template #paginatorprevpagelinkicon unstyled>prev</template>
    <template #paginatornextpagelinkicon unstyled>next</template>
    <template #paginatorlastpagelinkicon unstyled>last</template>

    <!-- No Column -->
    <Column sortField="id" header="No" sortable>
      <template #body="slotProps">
        {{ getRowNumber(slotProps.index) }}
      </template>
      <template #sorticon="{ sortOrder }">
        <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span>
        <span v-else-if="sortOrder === -1" style="font-size: 0.8rem">▼</span>
        <span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
      </template>
    </Column>

    <!-- Other Columns -->
    <Column field="code" header="Code" sortable>
      <template #body="{ data }">
        <span class="code-pill">{{ data.code }}</span>
      </template>
      <template #sorticon="{ sortOrder }">
        <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
        ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
          >▼</span
        ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
      </template>
    </Column>
    <Column field="name" header="Name" sortable>
      <template #body="{ data }">
        <span class="name-text" :title="data.name">{{ data.name }}</span>
      </template>
      <template #sorticon="{ sortOrder }">
        <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
        ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
          >▼</span
        ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
      </template>
    </Column>
    <Column field="birthday" header="Birthday" sortable>
      <template #body="{ data }">
        <span>{{ formatBirthday(data.birthday) }}</span>
      </template>
      <template #sorticon="{ sortOrder }">
        <span v-if="sortOrder === 1" style="font-size: 0.8rem">▲</span
        ><span v-else-if="sortOrder === -1" style="font-size: 0.8rem"
          >▼</span
        ><span v-else style="font-size: 0.8rem; color: #aaa">▲</span>
      </template>
    </Column>
    <Column field="address" header="Address">
      <template #body="{ data }">
        <span class="address-text" :title="data.address">{{ data.address }}</span>
      </template>
    </Column>
    <Column field="averageScore" header="Score" sortable>
      <template #body="{ data }">
        <span class="score-pill" :class="getScoreClass(data.averageScore)">
          {{ formatScore(data.averageScore) }}
        </span>
      </template>
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
          v-if="isAdmin"
          href="#"
          @click.prevent="$emit('edit', data)"
          class="action-link action-link--edit"
          aria-label="Edit student"
          title="Edit student"
          ><i class="pi pi-pen-to-square" aria-hidden="true"></i></a
        >
        <a
          v-if="isAdmin"
          href="#"
          @click.prevent="$emit('delete', data)"
          class="action-link action-link--delete"
          aria-label="Delete student"
          title="Delete student"
          ><i class="pi pi-trash" aria-hidden="true"></i></a
        >
        <span v-else class="no-actions">—</span>
      </template>
    </Column>

    <template #empty>
      <div class="empty-state">
        <i class="pi pi-inbox empty-icon" aria-hidden="true"></i>
        <p class="empty-title">No students found</p>
        <p class="empty-text">Try another search filter or add a new student.</p>
      </div>
    </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import type { Student } from "../types/student";

const props = withDefaults(
  defineProps<{
    students: Student[];
    loading: boolean;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    sortOrder?: 'asc' | 'desc';
    isAdmin?: boolean;
  }>(),
  { isAdmin: false }
);

defineEmits(['page', 'sort', 'edit', 'delete']);

const getRowNumber = (rowIndex: number) => {
  const ascOrderNumber = (props.currentPage - 1) * props.pageSize + rowIndex + 1;
  if (props.sortOrder === 'desc') {
    return Math.max(props.totalCount - ascOrderNumber + 1, 1);
  }
  return ascOrderNumber;
};

const formatBirthday = (birthday: string) => {
  const normalized = birthday?.trim();
  if (!normalized) return '-';

  // Keep a stable display format regardless of user locale.
  const directMatch = normalized.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (directMatch) {
    const [, year, month, day] = directMatch;
    return `${year}/${month}/${day}`;
  }

  const date = new Date(normalized.replace(/\//g, '-'));
  if (Number.isNaN(date.getTime())) return birthday || '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const formatScore = (score: number) => Number(score).toFixed(2).replace(/\.00$/, '');

const getScoreClass = (score: number) => {
  const normalizedScore = score > 10 ? score / 10 : score;
  if (normalizedScore >= 8) return 'score-pill--great';
  if (normalizedScore >= 6.5) return 'score-pill--good';
  if (normalizedScore >= 5) return 'score-pill--fair';
  return 'score-pill--low';
};
</script>

<style scoped>
.table-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
}

.caption-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.caption-icon {
  color: #059669;
  font-size: 1.2rem;
}

.caption-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #065f46;
}

.caption-subtitle {
  margin: 0.1rem 0 0;
  font-size: 0.82rem;
  color: #64748b;
}

.caption-total {
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 999px;
  border: 1px solid #a7f3d0;
  background: #f0fdf4;
  color: #047857;
}

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

:deep(.p-paginator-current) {
  margin-left: 0.75rem;
  color: #475569;
  font-size: 0.86rem;
}

:deep(.p-paginator-rpp-dropdown) {
  border: 1px solid #a7f3d0;
  border-radius: 8px;
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

.code-pill {
  display: inline-block;
  padding: 0.2rem 0.52rem;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  font-size: 0.8rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #334155;
}

.name-text {
  font-weight: 600;
  color: #0f172a;
}

.address-text {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #334155;
}

.score-pill {
  display: inline-block;
  min-width: 56px;
  text-align: center;
  font-weight: 700;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  font-size: 0.82rem;
  border: 1px solid transparent;
}

.score-pill--great {
  color: #065f46;
  background: #d1fae5;
  border-color: #6ee7b7;
}

.score-pill--good {
  color: #1d4ed8;
  background: #dbeafe;
  border-color: #93c5fd;
}

.score-pill--fair {
  color: #92400e;
  background: #fef3c7;
  border-color: #fcd34d;
}

.score-pill--low {
  color: #b91c1c;
  background: #fee2e2;
  border-color: #fca5a5;
}

.no-actions {
  color: #94a3b8;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 1.6rem 1rem;
  color: #475569;
}

.empty-icon {
  font-size: 1.6rem;
  color: #94a3b8;
}

.empty-title {
  margin: 0.45rem 0 0.25rem;
  font-weight: 700;
}

.empty-text {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .address-text {
    max-width: 180px;
  }

  .caption-subtitle {
    display: none;
  }
}
</style>
