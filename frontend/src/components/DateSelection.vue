<template>
  <div class="date-selection">
    <label for="diaryDate" class="label">Выберите дату дневника питания:</label>

    <div class="date-input-container">
      <button @click="changeDate(-1)" class="btn-secondary">←</button>

      <input
          id="diaryDate"
          :value="modelValue"
          type="date"
          class="input"
          @change="onDateChange"
      />

      <button @click="changeDate(1)" class="btn-secondary">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

function changeDate(days: number) {
  const currentDate = new Date(props.modelValue);
  currentDate.setDate(currentDate.getDate() + days);
  emit('update:modelValue', currentDate.toISOString().slice(0, 10));
}

function onDateChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<style scoped>
.date-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  padding: 2rem;
}

.label {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.date-input-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-secondary {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.input {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
