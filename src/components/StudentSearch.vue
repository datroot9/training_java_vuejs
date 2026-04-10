<template>
  <div class="Searching-student-groups">
    <div class="search-inputs">
      <div class="input-group">
        <label for="search-name">Student Name</label>
        <InputText id="search-name" v-model="name" />
      </div>
      <div class="input-group">
        <label for="search-code">Student Code</label>
        <InputText id="search-code" v-model="code" />
      </div>
      <div class="input-group">
        <label for="search-birthday">Birthday</label>
        <InputText
          id="search-birthday"
          v-model="birthday"
          type="date"
        />
      </div>
    </div>
    <div class="search-actions">
      <Button
        @click="$emit('search')"
        label="Search"
        icon="pi pi-search"
        class="search-btn action-btn"
        unstyled
      />
      <Button
        @click="$emit('add')"
        label="Add Student"
        icon="pi pi-user-plus"
        class="add-btn action-btn"
        unstyled
      />
      <Button
        @click="$emit('export')"
        label="Export"
        icon="pi pi-download"
        class="export-btn action-btn"
        unstyled
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const name = defineModel<string>('name');
const code = defineModel<string>('code');
const birthday = defineModel<string>('birthday');

defineEmits(['search', 'add', 'export']);
</script>

<style scoped>
.Searching-student-groups {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 40px;
  margin-bottom: 25px;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: linear-gradient(165deg, #f8fffb 0%, #ffffff 58%, #ecfdf5 100%);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
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
  font-weight: 700;
  color: #065f46;
  font-size: 0.9rem;
  min-width: 120px;
}

.search-inputs :deep(.p-inputtext) {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  border: 1px solid #bbf7d0;
  min-height: 40px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-inputs :deep(.p-inputtext:enabled:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.search-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  min-width: 170px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  border: 1px solid transparent;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease, border-color 0.15s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.search-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #3b82f6 100%);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.3);
}

.search-btn:hover {
  filter: brightness(1.05);
}

.add-btn {
  color: #5b21b6;
  border-color: #c4b5fd;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  box-shadow: 0 6px 14px rgba(124, 58, 237, 0.16);
}

.add-btn:hover {
  border-color: #a78bfa;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

.export-btn {
  color: #92400e;
  border-color: #fcd34d;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  box-shadow: 0 6px 14px rgba(245, 158, 11, 0.16);
}

.export-btn:hover {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

@media (max-width: 900px) {
  .Searching-student-groups {
    flex-direction: column;
    gap: 16px;
  }

  .search-inputs {
    width: 100%;
  }

  .search-actions {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: auto;
  }
}
</style>
