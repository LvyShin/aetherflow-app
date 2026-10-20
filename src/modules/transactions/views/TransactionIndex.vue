<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { TransactionDraft, TransactionView } from '../models/transaction'
import TransactionAccountFilter from '../components/home/TransactionAccountFilter.vue'
import TransactionBalanceCard from '../components/home/TransactionBalanceCard.vue'
import TransactionDaySection from '../components/home/TransactionDaySection.vue'
import TransactionEmptyState from '../components/home/TransactionEmptyState.vue'
import TransactionDetailSheet from '../components/detail/TransactionDetailSheet.vue'
import { useTransactionEditorStore } from '../stores/use_transaction_editor_store'
import { useTransactionStore } from '../stores/use_transaction_store'

const store = useTransactionStore()
const editorStore = useTransactionEditorStore()
const {
  accounts,
  categories,
  selectedAccountId,
  privacyMode,
  groupedTransactions,
  todayTotals,
  monthTotals,
  loading,
  error,
} = storeToRefs(store)

const selectedTransaction = ref<TransactionView | null>(null)
const savingDetail = ref(false)
const operationError = ref('')

const accountFilter = computed({
  get: () => selectedAccountId.value,
  set: store.setAccountFilter,
})

const displayAmount = (amount: number) => store.displayAmount(amount)

async function saveDetail(draft: TransactionDraft): Promise<void> {
  if (!selectedTransaction.value) return
  savingDetail.value = true
  operationError.value = ''
  try {
    const id = selectedTransaction.value.id
    await store.updateTransaction(id, draft)
    selectedTransaction.value = store.transactions.find((transaction) => transaction.id === id) ?? null
  } catch (reason) {
    operationError.value = reason instanceof Error ? reason.message : '流水修改失败'
  } finally {
    savingDetail.value = false
  }
}

async function deleteDetail(): Promise<void> {
  if (!selectedTransaction.value) return
  operationError.value = ''
  try {
    await store.deleteTransaction(selectedTransaction.value.id)
    selectedTransaction.value = null
  } catch (reason) {
    operationError.value = reason instanceof Error ? reason.message : '流水删除失败'
  }
}

function openFullEditor(transaction: TransactionView): void {
  selectedTransaction.value = null
  editorStore.openEdit(transaction)
}
</script>

<template>
  <div class="transaction-index">
    <TransactionBalanceCard
      :balance-negative="monthTotals.balance < 0"
      :month-balance="displayAmount(Math.abs(monthTotals.balance))"
      :month-expense="displayAmount(monthTotals.expense)"
      :month-income="displayAmount(monthTotals.income)"
      :privacy-mode="privacyMode"
      :today-expense="displayAmount(todayTotals.expense)"
      @toggle-privacy="store.togglePrivacy"
    />

    <TransactionAccountFilter v-model="accountFilter" :accounts="accounts" />

    <p v-if="error || operationError" class="form-error">{{ error || operationError }}</p>
    <div v-if="loading" class="loading-state"><span />正在打开本地账本…</div>
    <TransactionEmptyState
      v-else-if="groupedTransactions.length === 0"
      @create="editorStore.openCreate"
    />
    <TransactionDaySection
      v-for="group in groupedTransactions"
      v-else
      :key="group.dateKey"
      :display-amount="displayAmount"
      :group="group"
      :privacy-mode="privacyMode"
      @select="selectedTransaction = $event"
    />

    <TransactionDetailSheet
      v-if="selectedTransaction"
      :accounts="accounts"
      :categories="categories"
      :saving="savingDetail"
      :transaction="selectedTransaction"
      @close="selectedTransaction = null"
      @delete="deleteDetail"
      @edit="openFullEditor"
      @save="saveDetail"
    />
  </div>
</template>

<style scoped>
.loading-state {
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 260px;
  margin-top: 18px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
  color: var(--muted);
  font-size: 0.76rem;
}

.loading-state span {
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-soft);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.form-error {
  margin: 12px 0;
  color: var(--danger);
  font-size: 0.72rem;
  font-weight: 650;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
