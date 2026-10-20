<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppIcon from '../../../../shared/components/AppIcon.vue'

const model = defineModel<string>({ required: true })
const input = ref<HTMLInputElement | null>(null)

defineProps<{ resultCount: number }>()

onMounted(() => window.setTimeout(() => input.value?.focus(), 50))

function clear(): void {
  model.value = ''
  input.value?.focus()
}
</script>

<template>
  <section class="search-bar-wrap">
    <label class="search-input">
      <AppIcon name="search" :size="18" />
      <input
        ref="input"
        v-model="model"
        aria-label="搜索记账"
        autocomplete="off"
        placeholder="搜索商户、分类、账户或金额"
        type="search"
      />
      <button v-if="model" aria-label="清空搜索" type="button" @click="clear">
        <AppIcon name="close" :size="14" />
      </button>
    </label>
    <p>{{ model.trim() ? `找到 ${resultCount} 笔流水` : `最近 ${resultCount} 笔流水` }}</p>
  </section>
</template>

<style scoped>
.search-bar-wrap {
  display: grid;
  gap: 8px;
}

.search-input {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 9px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  color: var(--muted);
  box-shadow: 0 7px 20px rgba(40, 52, 82, 0.04);
}

input {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 0.78rem;
}

input::-webkit-search-cancel-button {
  display: none;
}

button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: var(--surface-soft);
  color: var(--muted);
  cursor: pointer;
}

p {
  margin: 0;
  padding-left: 3px;
  color: var(--muted);
  font-size: 0.63rem;
}
</style>
