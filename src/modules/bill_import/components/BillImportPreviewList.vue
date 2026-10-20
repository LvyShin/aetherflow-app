<script setup lang="ts">
import type { BillImportRowView } from '../models/bill_import'
import { toBillDateTime } from '../utils/datetime'

defineProps<{ rows: BillImportRowView[] }>()
</script>

<template>
  <section class="preview-card">
    <header>
      <strong>流水预览</strong>
      <span>展示前 {{ Math.min(rows.length, 20) }} 笔</span>
    </header>
    <div class="preview-list">
      <div v-for="row in rows.slice(0, 20)" :key="row.externalId" class="preview-row" :class="{ duplicate: row.duplicate }">
        <span class="category-mark">{{ row.flowType === 'INCOME' ? '收' : '支' }}</span>
        <div class="row-main">
          <strong>{{ row.merchant }}</strong>
          <small>{{ row.categoryName }}<template v-if="row.subcategoryName"> · {{ row.subcategoryName }}</template> · {{ row.accountName }}</small>
        </div>
        <div class="row-side">
          <strong :class="{ income: row.flowType === 'INCOME' }">{{ row.flowType === 'INCOME' ? '+' : '-' }}¥{{ row.amount.toFixed(2) }}</strong>
          <small>{{ toBillDateTime(row.transactedAt).slice(0, 10) }}</small>
        </div>
        <span v-if="row.duplicate" class="duplicate-label">已存在</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}

header strong {
  font-size: 0.78rem;
}

header span {
  color: var(--muted);
  font-size: 0.6rem;
}

.preview-row {
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  gap: 9px;
  align-items: center;
  margin: 0 12px;
  padding: 11px 4px;
  border-top: 1px solid var(--line);
}

.preview-row.duplicate {
  opacity: 0.52;
}

.category-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--surface-soft);
  color: var(--muted-strong);
  font-size: 0.62rem;
  font-weight: 800;
}

.row-main,
.row-side {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.row-main strong {
  overflow: hidden;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-main small,
.row-side small {
  color: var(--muted);
  font-size: 0.58rem;
}

.row-side {
  justify-items: end;
}

.row-side strong {
  font-size: 0.7rem;
}

.row-side strong.income {
  color: var(--income);
}

.duplicate-label {
  position: absolute;
  top: 5px;
  right: 2px;
  padding: 2px 5px;
  border-radius: 5px;
  background: var(--surface-soft);
  color: var(--muted);
  font-size: 0.5rem;
}
</style>
