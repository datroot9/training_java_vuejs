<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
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
        for <strong>{{ student?.name }}</strong
        >?</span
      >
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 10px">
      <Button
        label="Cancel"
        @click="$emit('cancel')"
        severity="secondary"
        outlined
      />
      <Button
        label="Delete"
        @click="$emit('confirm')"
        severity="danger"
        autofocus
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { Student } from "../types/student";

defineProps<{
  visible: boolean;
  student: Student | null;
}>();

defineEmits(['update:visible', 'cancel', 'confirm']);
</script>
