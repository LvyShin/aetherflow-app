import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useTransactionStore } from './use_transaction_store'

export const useTransactionSelectionStore = defineStore('transaction-selection', () => {
  const transactionStore = useTransactionStore()
  const active = ref(false)
  const selectedIds = ref<string[]>([])
  const deleting = ref(false)
  const error = ref('')
  const selectedCount = computed(() => selectedIds.value.length)

  function toggleMode(): void {
    if (active.value) cancel()
    else active.value = true
  }

  function cancel(): void {
    active.value = false
    selectedIds.value = []
    error.value = ''
  }

  function toggle(id: string): void {
    if (!active.value) return
    selectedIds.value = selectedIds.value.includes(id)
      ? selectedIds.value.filter((selectedId) => selectedId !== id)
      : [...selectedIds.value, id]
  }

  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id)
  }

  /** 全选当前可见（已按账户筛选）的流水。 */
  function selectAll(): void {
    if (!active.value) return
    selectedIds.value = transactionStore.filteredTransactions.map((transaction) => transaction.id)
  }

  /** 清空选择但保留多选模式。 */
  function clearSelection(): void {
    selectedIds.value = []
  }

  function isAllSelected(ids: string[]): boolean {
    return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id))
  }

  function toggleAll(): void {
    if (isAllSelected(transactionStore.filteredTransactions.map((transaction) => transaction.id))) {
      clearSelection()
    } else {
      selectAll()
    }
  }

  async function deleteSelected(): Promise<number> {
    if (selectedIds.value.length === 0) return 0
    deleting.value = true
    error.value = ''
    try {
      const deleted = await transactionStore.deleteTransactions(selectedIds.value)
      cancel()
      return deleted
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '批量删除失败'
      throw reason
    } finally {
      deleting.value = false
    }
  }

  return {
    active,
    selectedIds,
    selectedCount,
    deleting,
    error,
    toggleMode,
    cancel,
    toggle,
    isSelected,
    selectAll,
    clearSelection,
    isAllSelected,
    toggleAll,
    deleteSelected,
  }
})
