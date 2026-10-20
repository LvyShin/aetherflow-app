<script setup lang="ts">
import type { CategoryEntity } from '../../../categories/models/category'

defineProps<{
  primaryCategories: CategoryEntity[]
  subcategories: CategoryEntity[]
  selectedPrimaryId: string
  selectedCategoryId: string
}>()

const emit = defineEmits<{
  selectPrimary: [id: string]
  'update:selectedCategoryId': [id: string]
}>()
</script>

<template>
  <div class="inline-editor category-editor">
    <label>
      大类
      <select :value="selectedPrimaryId" @change="emit('selectPrimary', ($event.target as HTMLSelectElement).value)">
        <option v-for="category in primaryCategories" :key="category.id" :value="category.id">
          {{ category.icon }} {{ category.name }}
        </option>
      </select>
    </label>
    <label v-if="subcategories.length">
      子分类
      <select
        :value="selectedCategoryId"
        @change="emit('update:selectedCategoryId', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="category in subcategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.inline-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 12px 0;
  padding: 12px;
  border-radius: 14px;
  background: var(--surface-soft);
}

label {
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 0.63rem;
  font-weight: 650;
}

select {
  min-width: 0;
  width: 100%;
  padding: 8px 9px;
  border: 1px solid var(--line);
  border-radius: 9px;
  outline: none;
  background: var(--surface);
  color: var(--text);
  font-size: 0.72rem;
}
</style>
