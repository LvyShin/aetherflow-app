<script setup lang="ts">
import type { BillImportIssue } from '../models/bill_import'

defineProps<{ issues: BillImportIssue[] }>()
</script>

<template>
  <details v-if="issues.length" class="issue-list">
    <summary>{{ issues.length }} 行未导入，查看原因</summary>
    <ul>
      <li v-for="issue in issues.slice(0, 30)" :key="`${issue.row}-${issue.message}`">
        第 {{ issue.row }} 行：{{ issue.message }}
      </li>
    </ul>
    <p v-if="issues.length > 30">仅展示前 30 条问题。</p>
  </details>
</template>

<style scoped>
.issue-list {
  padding: 13px 15px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

summary {
  color: var(--muted-strong);
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 700;
}

ul {
  display: grid;
  gap: 5px;
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--muted);
  font-size: 0.63rem;
  line-height: 1.55;
}

p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.6rem;
}
</style>
