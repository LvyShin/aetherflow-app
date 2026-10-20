<script setup lang="ts">
defineProps<{
  resultCount: number
  expense: number
  income: number
  privacyMode: boolean
}>()
</script>

<template>
  <section class="search-summary">
    <div><span>搜索结果</span><strong>{{ resultCount }} 笔</strong></div>
    <div><span>支出合计</span><strong>-¥{{ privacyMode ? '****' : expense.toFixed(2) }}</strong></div>
    <div><span>收入合计</span><strong class="income">+¥{{ privacyMode ? '****' : income.toFixed(2) }}</strong></div>
  </section>
</template>

<style scoped>
.search-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
}

.search-summary div {
  display: grid;
  gap: 4px;
  padding: 12px 10px;
  border-right: 1px solid var(--line);
  text-align: center;
}

.search-summary div:last-child {
  border-right: 0;
}

span {
  color: var(--muted);
  font-size: 0.58rem;
}

strong {
  font-size: 0.72rem;
}

strong.income {
  color: var(--income);
}
</style>
