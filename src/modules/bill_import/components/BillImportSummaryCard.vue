<script setup lang="ts">
import { computed } from 'vue'
import type { BillImportPreview } from '../models/bill_import'
import { toBillDateTime } from '../utils/datetime'

const props = defineProps<{
  preview: BillImportPreview
  duplicateCount: number
  importableCount: number
}>()

const channelLabel = computed(() => (props.preview.channel === 'WECHAT' ? '微信支付' : '支付宝'))
const dateRange = computed(() => {
  if (!props.preview.earliestAt || !props.preview.latestAt) return ''
  return `${toBillDateTime(props.preview.earliestAt).slice(0, 10)} 至 ${toBillDateTime(props.preview.latestAt).slice(0, 10)}`
})
</script>

<template>
  <section class="summary-card">
    <header>
      <div>
        <span>{{ channelLabel }} · {{ preview.fileType }}</span>
        <strong>{{ preview.fileName }}</strong>
      </div>
      <span class="valid-badge">解析完成</span>
    </header>
    <div class="totals-grid">
      <div><span>可导入</span><strong>{{ importableCount }} 笔</strong></div>
      <div><span>重复跳过</span><strong>{{ duplicateCount }} 笔</strong></div>
      <div><span>支出合计</span><strong>¥{{ preview.totalExpense.toFixed(2) }}</strong></div>
      <div><span>收入合计</span><strong class="income">¥{{ preview.totalIncome.toFixed(2) }}</strong></div>
    </div>
    <p>
      {{ dateRange }} · 有效 {{ preview.rows.length }} 笔，过滤 {{ preview.skippedRows }} 笔，
      {{ preview.issues.length }} 行格式异常
    </p>
  </section>
</template>

<style scoped>
.summary-card {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

header div {
  display: grid;
  min-width: 0;
  gap: 4px;
}

header div span {
  color: var(--primary);
  font-size: 0.62rem;
  font-weight: 750;
}

header strong {
  overflow: hidden;
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.valid-badge {
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--income) 12%, var(--surface));
  color: var(--income);
  font-size: 0.6rem;
  font-weight: 750;
}

.totals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 15px;
  padding: 14px;
  border-radius: 16px;
  background: var(--surface-soft);
}

.totals-grid div {
  display: grid;
  gap: 4px;
}

.totals-grid span {
  color: var(--muted);
  font-size: 0.62rem;
}

.totals-grid strong {
  font-size: 0.9rem;
}

.totals-grid strong.income {
  color: var(--income);
}

p {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.64rem;
  line-height: 1.6;
}
</style>
