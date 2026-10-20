<script setup lang="ts">
const emit = defineEmits<{ openPicker: [] }>()

defineProps<{
  monthLabel: string
  expense: string
  income: string
}>()
</script>

<template>
  <header class="month-header">
    <button class="month-title" type="button" @click="emit('openPicker')">{{ monthLabel }}</button>
    <span class="month-totals">
      <span class="expense">支{{ expense }}</span>
      <span class="income">收{{ income }}</span>
    </span>
  </header>
</template>

<style scoped>
.month-header {
  position: sticky;
  z-index: 12;
  top: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin: 0 -14px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
  box-shadow: 0 4px 14px rgba(30, 42, 70, 0.06);
}

.month-title {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-size: 1.02rem;
  font-weight: 800;
}

.month-title::after {
  content: '▾';
  color: var(--muted);
  font-size: 0.7rem;
}

.month-totals {
  display: flex;
  gap: 14px;
  color: var(--muted-strong);
  font-size: 0.82rem;
  font-weight: 720;
}

.income {
  color: var(--muted);
}

@media (max-width: 360px) {
  .month-header {
    margin: 0 -10px;
    padding-right: 10px;
    padding-left: 10px;
  }
}
</style>
