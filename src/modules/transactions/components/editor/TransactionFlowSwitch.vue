<script setup lang="ts">
import type { CategoryFlowType } from '../../../categories/models/category'

defineProps<{ modelValue: CategoryFlowType }>()
const emit = defineEmits<{ 'update:modelValue': [value: CategoryFlowType] }>()
</script>

<template>
  <div class="flow-switch" role="group" aria-label="收支类型">
    <button :class="{ active: modelValue === 'EXPENSE' }" @click="emit('update:modelValue', 'EXPENSE')">
      支出
    </button>
    <button :class="{ active: modelValue === 'INCOME' }" @click="emit('update:modelValue', 'INCOME')">
      收入
    </button>
  </div>
</template>

<style scoped>
.flow-switch {
  display: flex;
  padding: 3px;
  border-radius: 11px;
  background: var(--surface-soft);
}

button {
  min-width: 44px;
  padding: 6px 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 750;
}

button.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(56, 85, 224, 0.22);
}
</style>
