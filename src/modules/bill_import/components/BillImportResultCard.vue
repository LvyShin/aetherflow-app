<script setup lang="ts">
import type { BillImportCommitResult } from '../models/bill_import'

defineProps<{ result: BillImportCommitResult }>()
defineEmits<{ reset: [] }>()
</script>

<template>
  <section class="result-card">
    <span class="success-icon">✓</span>
    <h2>账单导入完成</h2>
    <p>新增 {{ result.inserted }} 笔，重复 {{ result.duplicates }} 笔，规则过滤 {{ result.skipped }} 笔。</p>
    <div class="result-stats">
      <div><span>识别总数</span><strong>{{ result.total }}</strong></div>
      <div><span>成功入账</span><strong>{{ result.inserted }}</strong></div>
    </div>
    <button @click="$emit('reset')">继续导入</button>
  </section>
</template>

<style scoped>
.result-card {
  display: grid;
  justify-items: center;
  padding: 34px 22px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
  text-align: center;
}

.success-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--income) 13%, var(--surface));
  color: var(--income);
  font-size: 1.45rem;
  font-weight: 850;
}

h2 {
  margin: 15px 0 5px;
  font-size: 1.08rem;
}

p {
  margin: 0;
  color: var(--muted);
  font-size: 0.7rem;
}

.result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin: 20px 0;
}

.result-stats div {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 14px;
  background: var(--surface-soft);
}

.result-stats span {
  color: var(--muted);
  font-size: 0.6rem;
}

.result-stats strong {
  font-size: 1rem;
}

button {
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 750;
}
</style>
