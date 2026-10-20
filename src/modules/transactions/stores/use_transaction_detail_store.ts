import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TransactionDraft, TransactionView } from '../models/transaction'
import { useTransactionStore } from './use_transaction_store'

export const useTransactionDetailStore = defineStore('transaction-detail', () => {
  const transactionStore = useTransactionStore()
  const selectedId = ref<string | null>(null)
  const saving = ref(false)
  const error = ref('')

  const selectedTransaction = computed(
    () => transactionStore.transactions.find((transaction) => transaction.id === selectedId.value) ?? null,
  )

  function open(transaction: TransactionView): void {
    selectedId.value = transaction.id
    error.value = ''
  }

  function close(): void {
    selectedId.value = null
    error.value = ''
  }

  async function save(draft: TransactionDraft): Promise<void> {
    if (!selectedId.value) return
    saving.value = true
    error.value = ''
    try {
      await transactionStore.updateTransaction(selectedId.value, draft)
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '流水修改失败'
      throw reason
    } finally {
      saving.value = false
    }
  }

  async function remove(): Promise<void> {
    if (!selectedId.value) return
    error.value = ''
    try {
      await transactionStore.deleteTransaction(selectedId.value)
      close()
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '流水删除失败'
      throw reason
    }
  }

  return { selectedTransaction, saving, error, open, close, save, remove }
})
