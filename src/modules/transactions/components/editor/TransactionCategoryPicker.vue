<script setup lang="ts">
import type { CategoryEntity } from '../../../categories/models/category'

defineProps<{
  primaryCategories: CategoryEntity[]
  subcategories: CategoryEntity[]
  selectedPrimaryId: string
  selectedSubcategoryId: string
}>()

const emit = defineEmits<{
  selectPrimary: [category: CategoryEntity]
  selectSubcategory: [category: CategoryEntity]
}>()
</script>

<template>
  <div class="category-grid">
    <button
      v-for="category in primaryCategories"
      :key="category.id"
      class="category-option"
      :class="{ active: selectedPrimaryId === category.id }"
      type="button"
      @click="emit('selectPrimary', category)"
    >
      <span>{{ category.icon }}</span>
      <small>{{ category.name }}</small>
    </button>
  </div>

  <div v-if="subcategories.length" class="subcategory-strip">
    <button
      v-for="category in subcategories"
      :key="category.id"
      :class="{ active: selectedSubcategoryId === category.id }"
      type="button"
      @click="emit('selectSubcategory', category)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(2, 65px);
  grid-auto-columns: 57px;
  gap: 8px 5px;
  margin: 0 -18px;
  padding: 2px 18px 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-grid::-webkit-scrollbar,
.subcategory-strip::-webkit-scrollbar {
  display: none;
}

.category-option {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 4px;
  padding: 5px 2px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--muted-strong);
  cursor: pointer;
}

.category-option > span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: var(--surface);
  font-size: 1.1rem;
}

.category-option small {
  font-size: 0.59rem;
  font-weight: 650;
}

.category-option.active > span {
  background: var(--primary);
  box-shadow: 0 7px 18px rgba(56, 85, 224, 0.25);
}

.category-option.active small {
  color: var(--primary);
  font-weight: 800;
}

.subcategory-strip {
  display: flex;
  gap: 6px;
  margin: 0 -18px 10px;
  padding: 0 18px 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.subcategory-strip button {
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
  font-size: 0.62rem;
  font-weight: 700;
}

.subcategory-strip button.active {
  border-color: color-mix(in srgb, var(--primary) 38%, var(--surface));
  background: var(--primary-soft);
  color: var(--primary);
}
</style>
