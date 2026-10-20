<script setup lang="ts">
import type { TransactionGroup, TransactionView } from '../../models/transaction'
import TransactionListItem from './TransactionListItem.vue'

defineProps<{
  group: TransactionGroup
  privacyMode: boolean
  displayAmount: (amount: number) => string
}>()

const emit = defineEmits<{ select: [transaction: TransactionView] }>()
</script>

<template>
  <section class="day-group">
    <header class="day-header">
      <strong>{{ group.dateLabel }}</strong>
      <span>
        支 {{ privacyMode ? '****' : `¥${group.expense.toFixed(2)}` }}
        <template v-if="group.income > 0">
          · 收 {{ privacyMode ? '****' : `¥${group.income.toFixed(2)}` }}
        </template>
      </span>
    </header>
    <div class="transaction-list">
      <TransactionListItem
        v-for="transaction in group.items"
        :key="transaction.id"
        :amount-text="displayAmount(transaction.amount)"
        :privacy-mode="privacyMode"
        :transaction="transaction"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.day-group {
  margin-top: 15px;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 8px;
  color: var(--muted);
  font-size: 0.7rem;
  font-weight: 650;
}

.day-header strong {
  color: var(--muted-strong);
  font-size: 0.76rem;
}

.transaction-list {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: 0 6px 20px rgba(40, 52, 82, 0.035);
}
</style>
