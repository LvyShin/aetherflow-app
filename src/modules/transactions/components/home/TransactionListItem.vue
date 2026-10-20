<script setup lang="ts">
import type { TransactionView } from '../../models/transaction'

defineProps<{
  transaction: TransactionView
  amountText: string
  privacyMode: boolean
}>()

const emit = defineEmits<{ select: [transaction: TransactionView] }>()

function timeText(timestamp: number): string {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <button class="transaction-row" @click="emit('select', transaction)">
    <span class="transaction-icon">{{ transaction.categoryIcon }}</span>
    <span class="transaction-main">
      <strong>{{ transaction.merchant }}</strong>
      <small>
        {{ transaction.primaryCategoryName }}
        <template v-if="transaction.subcategoryName"> · {{ transaction.subcategoryName }}</template>
      </small>
    </span>
    <span class="transaction-side">
      <strong :class="{ income: transaction.flowType === 'INCOME' }">
        {{ transaction.flowType === 'INCOME' ? '+' : '-' }}¥{{ amountText }}
      </strong>
      <small>{{ transaction.accountName }} · {{ timeText(transaction.transactedAt) }}</small>
    </span>
    <span v-if="privacyMode" class="sr-only">金额已隐藏</span>
  </button>
</template>

<style scoped>
.transaction-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
  width: 100%;
  padding: 13px 14px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.transaction-row:last-child {
  border-bottom: 0;
}

.transaction-row:active {
  background: var(--surface-soft);
}

.transaction-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--surface-soft);
  font-size: 1.25rem;
}

.transaction-main,
.transaction-side {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.transaction-main strong {
  overflow: hidden;
  font-size: 0.83rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-main small,
.transaction-side small {
  overflow: hidden;
  color: var(--muted);
  font-size: 0.66rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-side {
  justify-items: end;
  text-align: right;
}

.transaction-side strong {
  font-size: 0.85rem;
  font-weight: 800;
}

.transaction-side strong.income {
  color: var(--income);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media (max-width: 360px) {
  .transaction-row {
    grid-template-columns: 38px minmax(0, 1fr) auto;
    padding-right: 11px;
    padding-left: 11px;
  }

  .transaction-icon {
    width: 38px;
    height: 38px;
  }
}
</style>
