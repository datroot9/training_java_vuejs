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
        class="search-btn"
        unstyled
      />
      <Button
        @click="$emit('add')"
        label="Add Student"
        class="add-btn"
        unstyled
      />
      <Button
        @click="$emit('export')"
        label="Export"
        class="export-btn"
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
</style>
