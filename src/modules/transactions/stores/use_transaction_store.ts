import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AccountEntity } from '../../accounts/models/account'
import type { CategoryEntity } from '../../categories/models/category'
import type {
  TransactionDraft,
  TransactionImportResult,
  TransactionView,
} from '../models/transaction'
import { SqliteTransactionRepository } from '../repositories/sqlite_transaction_repository'
import {
  calculateTransactionTotals,
  groupTransactionsByDay,
} from '../services/transaction_aggregator'

const repository = new SqliteTransactionRepository()

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<TransactionView[]>([])
  const accounts = ref<AccountEntity[]>([])
  const categories = ref<CategoryEntity[]>([])
  const selectedAccountId = ref('ALL')
  const privacyMode = ref(false)
  const loading = ref(false)
  const error = ref('')
  let initialized = false

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const filteredTransactions = computed(() => {
    if (selectedAccountId.value === 'ALL') return transactions.value
    return transactions.value.filter((transaction) => transaction.accountId === selectedAccountId.value)
  })

  const groupedTransactions = computed(() => groupTransactionsByDay(filteredTransactions.value))
  const todayTotals = computed(() =>
    calculateTransactionTotals(transactions.value, todayStart, tomorrowStart),
  )
  const monthTotals = computed(() =>
    calculateTransactionTotals(transactions.value, monthStart, nextMonthStart),
  )

  async function initialize(): Promise<void> {
    if (initialized || loading.value) return
    loading.value = true
    error.value = ''
    try {
      await repository.initialize()
      const [loadedTransactions, loadedAccounts, loadedCategories] = await Promise.all([
        repository.listTransactions(),
        repository.listAccounts(),
        repository.listCategories(),
      ])
      transactions.value = loadedTransactions
      accounts.value = loadedAccounts
      categories.value = loadedCategories
      initialized = true
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '本地账本初始化失败'
    } finally {
      loading.value = false
    }
  }

  async function refreshTransactions(): Promise<void> {
    transactions.value = await repository.listTransactions()
  }

  async function createTransaction(draft: TransactionDraft): Promise<void> {
    await repository.createTransaction(draft)
    await refreshTransactions()
  }

  async function updateTransaction(id: string, draft: TransactionDraft): Promise<void> {
    await repository.updateTransaction(id, draft)
    await refreshTransactions()
  }

  async function importTransactions(
    drafts: TransactionDraft[],
    batchId: string,
  ): Promise<TransactionImportResult> {
    const result = await repository.importTransactions(drafts, batchId)
    await refreshTransactions()
    return result
  }

  async function deleteTransaction(id: string): Promise<void> {
    await repository.deleteTransaction(id)
    await refreshTransactions()
  }

  async function deleteTransactions(ids: string[]): Promise<number> {
    const deleted = await repository.deleteTransactions(ids)
    await refreshTransactions()
    return deleted
  }

  function setAccountFilter(accountId: string): void {
    selectedAccountId.value = accountId
  }

  function togglePrivacy(): void {
    privacyMode.value = !privacyMode.value
  }

  function displayAmount(amount: number): string {
    if (privacyMode.value) return '****'
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return {
    transactions,
    accounts,
    categories,
    selectedAccountId,
    privacyMode,
    loading,
    error,
    filteredTransactions,
    groupedTransactions,
    todayTotals,
    monthTotals,
    initialize,
    createTransaction,
    updateTransaction,
    importTransactions,
    deleteTransaction,
    deleteTransactions,
    setAccountFilter,
    togglePrivacy,
    displayAmount,
  }
})
