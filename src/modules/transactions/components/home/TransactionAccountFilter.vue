<script setup lang="ts">
import { computed } from 'vue'
import type { AccountEntity } from '../../../accounts/models/account'

const props = defineProps<{
  accounts: AccountEntity[]
  modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const filters = computed(() => [
  { id: 'ALL', name: '全部账户' },
  ...props.accounts.map((account) => ({ id: account.id, name: account.name })),
])
</script>

<template>
  <div class="filter-bar" role="tablist" aria-label="账户筛选">
    <button
      v-for="filter in filters"
      :key="filter.id"
      :class="{ active: modelValue === filter.id }"
      :aria-selected="modelValue === filter.id"
      role="tab"
      @click="emit('update:modelValue', filter.id)"
    >
      {{ filter.name }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 8px;
  margin: 14px -14px 4px;
  padding: 2px 14px 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

button {
  flex: 0 0 auto;
  padding: 8px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted-strong);
  cursor: pointer;
  font-size: 0.73rem;
  font-weight: 700;
}

button.active {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
  box-shadow: 0 6px 16px rgba(56, 85, 224, 0.24);
}
</style>
