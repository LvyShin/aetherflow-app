import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TransactionDraft, TransactionView } from '../models/transaction'
import { useTransactionStore } from './use_transaction_store'

export const useTransactionEditorStore = defineStore('transaction-editor', () => {
  const transactionStore = useTransactionStore()
  const open = ref(false)
  const transaction = ref<TransactionView | null>(null)
  const saving = ref(false)

  function openCreate(): void {
    transaction.value = null
    open.value = true
  }

  function openEdit(value: TransactionView): void {
    transaction.value = value
    open.value = true
  }

  function close(): void {
    open.value = false
    transaction.value = null
  }

  async function save(draft: TransactionDraft): Promise<string> {
    saving.value = true
    try {
      if (transaction.value) {
        await transactionStore.updateTransaction(transaction.value.id, draft)
        close()
        return '流水已更新'
      }
      await transactionStore.createTransaction(draft)
      close()
      return '流水已保存到本地账本'
    } finally {
      saving.value = false
    }
  }

  return { open, transaction, saving, openCreate, openEdit, close, save }
})
