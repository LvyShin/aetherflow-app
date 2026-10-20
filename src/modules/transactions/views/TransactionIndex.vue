<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { TransactionDraft, TransactionView } from '../models/transaction'
import TransactionAccountFilter from '../components/home/TransactionAccountFilter.vue'
import TransactionBalanceCard from '../components/home/TransactionBalanceCard.vue'
import TransactionDaySection from '../components/home/TransactionDaySection.vue'
import TransactionMonthHeader from '../components/home/TransactionMonthHeader.vue'
import TransactionMonthPicker from '../components/home/TransactionMonthPicker.vue'
import TransactionEmptyState from '../components/home/TransactionEmptyState.vue'
import TransactionDetailSheet from '../components/detail/TransactionDetailSheet.vue'
import TransactionSelectionBar from '../components/selection/TransactionSelectionBar.vue'
import YesterdayReviewSheet from '../components/yesterday/YesterdayReviewSheet.vue'
import {
  formatDayLabel,
  formatMonthLabel,
  getMonthRange,
  getYesterday,
  resolveVisibleMonth,
  selectTransactionsForDay,
} from '../services/transaction_date'
import { groupTransactionsByDay } from '../services/transaction_aggregator'
import { useTransactionEditorStore } from '../stores/use_transaction_editor_store'
import { useTransactionDetailStore } from '../stores/use_transaction_detail_store'
import { useTransactionSelectionStore } from '../stores/use_transaction_selection_store'
import { useTransactionStore } from '../stores/use_transaction_store'

const store = useTransactionStore()
const editorStore = useTransactionEditorStore()
const detailStore = useTransactionDetailStore()
const selectionStore = useTransactionSelectionStore()
const {
  transactions,
  accounts,
  categories,
  selectedAccountId,
  privacyMode,
  groupedTransactions,
  filteredTransactions,
  todayTotals,
  monthTotals,
  loading,
  error,
} = storeToRefs(store)
const {
  selectedTransaction,
  saving: savingDetail,
  error: detailError,
} = storeToRefs(detailStore)
const {
  active: selectionActive,
  selectedIds,
  selectedCount,
  deleting: selectionDeleting,
  error: selectionError,
} = storeToRefs(selectionStore)
const yesterdaySheetOpen = ref(false)
const monthPickerOpen = ref(false)

function handleOpenYesterdayReview(): void {
  yesterdaySheetOpen.value = true
}

const listContainer = ref<HTMLElement | null>(null)
let scrollContainer: HTMLElement | null = null
const visibleMonthKey = ref('')
const currentMonthKey = resolveVisibleMonth(Date.now(), Date.now())
const monthKeys = computed(() => {
  const keys = new Set(
    filteredTransactions.value.map((transaction) =>
      resolveVisibleMonth(transaction.transactedAt, transaction.transactedAt),
    ),
  )
  return [...keys].sort((left, right) => right.localeCompare(left))
})

const listMonthKey = computed(() => visibleMonthKey.value || monthKeys.value[0] || '')
const showMonthHeader = computed(
  () => Boolean(listMonthKey.value) && listMonthKey.value !== currentMonthKey,
)

const listMonthLabel = computed(() => formatMonthLabel(listMonthKey.value || '1970-01'))
const listMonthTotals = computed(() => {
  if (!listMonthKey.value) return { expense: '0.00', income: '0.00' }
  const { start, end } = getMonthRange(listMonthKey.value)
  return {
    expense: displayAmountRaw(
      filteredTransactions.value.reduce((total, transaction) => {
        if (transaction.transactedAt < start.getTime() || transaction.transactedAt >= end.getTime()) return total
        return transaction.flowType === 'EXPENSE' ? total + transaction.amount : total
      }, 0),
    ),
    income: displayAmountRaw(
      filteredTransactions.value.reduce((total, transaction) => {
        if (transaction.transactedAt < start.getTime() || transaction.transactedAt >= end.getTime()) return total
        return transaction.flowType === 'INCOME' ? total + transaction.amount : total
      }, 0),
    ),
  }
})

function displayAmountRaw(amount: number): string {
  return (Math.round(amount * 100) / 100).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const visibleIds = computed(() => filteredTransactions.value.map((transaction) => transaction.id))
const allSelected = computed(() => selectionStore.isAllSelected(visibleIds.value))

const yesterday = getYesterday()
const yesterdayLabel = formatDayLabel(yesterday)
const yesterdayTransactions = computed(() => selectTransactionsForDay(transactions.value, yesterday))
const yesterdayGroup = computed(() => groupTransactionsByDay(yesterdayTransactions.value)[0] ?? null)
const yesterdayTotals = computed(() => ({
  expense: sumAmounts('EXPENSE'),
  income: sumAmounts('INCOME'),
}))

function updateVisibleMonth(): void {
  const container = scrollContainer
  if (!container) return
  const stickyTop = container.getBoundingClientRect().top + 48
  let current = monthKeys.value[0] ?? ''
  for (const monthKey of monthKeys.value) {
    const element = container.querySelector<HTMLElement>(`[data-month="${monthKey}"]`)
    if (!element) continue
    if (element.getBoundingClientRect().bottom > stickyTop) {
      current = monthKey
      break
    }
    current = monthKey
  }
  visibleMonthKey.value = current
}

function registerScrollListener(): void {
  scrollContainer = listContainer.value?.closest<HTMLElement>('.app-main') ?? null
  scrollContainer?.addEventListener('scroll', updateVisibleMonth, { passive: true })
  updateVisibleMonth()
}

onMounted(() => {
  registerScrollListener()
  window.addEventListener('aetherflow:open-yesterday-review', handleOpenYesterdayReview as EventListener)
  nextTick(() => updateVisibleMonth())
})

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener('scroll', updateVisibleMonth)
  window.removeEventListener('aetherflow:open-yesterday-review', handleOpenYesterdayReview as EventListener)
})

const accountFilter = computed({
  get: () => selectedAccountId.value,
  set: store.setAccountFilter,
})

const displayAmount = (amount: number) => store.displayAmount(amount)

async function saveDetail(draft: TransactionDraft): Promise<void> {
  try {
    await detailStore.save(draft)
  } catch {
    // 错误信息由详情 Store 统一展示。
  }
}

async function deleteDetail(): Promise<void> {
  try {
    await detailStore.remove()
  } catch {
    // 错误信息由详情 Store 统一展示。
  }
}

function openFullEditor(transaction: TransactionView): void {
  detailStore.close()
  editorStore.openEdit(transaction)
}

function handleTransactionClick(transaction: TransactionView): void {
  if (selectionActive.value) selectionStore.toggle(transaction.id)
  else detailStore.open(transaction)
}

async function deleteSelected(): Promise<void> {
  if (selectedCount.value === 0) return
  if (!window.confirm(`确定删除已选的 ${selectedCount.value} 笔流水吗？删除后无法恢复。`)) return
  try {
    await selectionStore.deleteSelected()
  } catch {
    // 错误信息由选择状态统一展示。
  }
}

function openYesterdayDetail(transaction: TransactionView): void {
  yesterdaySheetOpen.value = false
  detailStore.open(transaction)
}

function handleMonthPicked(monthKey: string): void {
  monthPickerOpen.value = false
  const target = monthKeys.value.includes(monthKey) ? monthKey : monthKeys.value[0]
  if (!target) return
  visibleMonthKey.value = target
  const container = scrollContainer
  if (!container) return
  if (target === currentMonthKey) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const dayGroup = container.querySelector<HTMLElement>(`[data-month="${target}"]`)
  if (!dayGroup) return
  const targetTop =
    dayGroup.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop
  container.scrollTo({ top: Math.max(0, targetTop - 50), behavior: 'smooth' })
}

function addYesterdayMissing(): void {
  yesterdaySheetOpen.value = false
  editorStore.openCreate()
}

function sumAmounts(flowType: 'EXPENSE' | 'INCOME'): number {
  return (
    Math.round(
      yesterdayTransactions.value
        .filter((transaction) => transaction.flowType === flowType)
        .reduce((total, transaction) => total + transaction.amount, 0) * 100,
    ) / 100
  )
}
</script>

<template>
  <div ref="listContainer" class="transaction-index">
    <TransactionMonthHeader
      v-if="showMonthHeader"
      :expense="privacyMode ? '****' : `¥${listMonthTotals.expense}`"
      :income="privacyMode ? '****' : `¥${listMonthTotals.income}`"
      :month-label="listMonthLabel"
      @open-picker="monthPickerOpen = true"
    />

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

    <p v-if="error || detailError || selectionError" class="form-error">
      {{ error || detailError || selectionError }}
    </p>
    <div v-if="loading" class="loading-state"><span />正在打开本地账本…</div>
    <TransactionEmptyState
      v-else-if="groupedTransactions.length === 0"
      @create="editorStore.openCreate"
    />
    <TransactionDaySection
      v-for="group in groupedTransactions"
      v-else
      :key="group.dateKey"
      :data-month="group.dateKey.slice(0, 7)"
      :display-amount="displayAmount"
      :group="group"
      :privacy-mode="privacyMode"
      :selected-ids="selectedIds"
      :selection-mode="selectionActive"
      @select="handleTransactionClick"
    />

    <TransactionDetailSheet
      v-if="selectedTransaction"
      :accounts="accounts"
      :categories="categories"
      :saving="savingDetail"
      :transaction="selectedTransaction"
      @close="detailStore.close"
      @delete="deleteDetail"
      @edit="openFullEditor"
      @save="saveDetail"
    />

    <YesterdayReviewSheet
      :date-label="yesterdayLabel"
      :display-amount="displayAmount"
      :group="yesterdayGroup"
      :open="yesterdaySheetOpen"
      :privacy-mode="privacyMode"
      @add-missing="addYesterdayMissing"
      @close="yesterdaySheetOpen = false"
      @select="openYesterdayDetail"
    />

    <TransactionMonthPicker
      :open="monthPickerOpen"
      :initial-month="listMonthKey || resolveVisibleMonth(Date.now(), Date.now())"
      :months="monthKeys"
      @close="monthPickerOpen = false"
      @confirm="handleMonthPicked"
    />

    <TransactionSelectionBar
      v-if="selectionActive"
      :all-selected="allSelected"
      :count="selectedCount"
      :deleting="selectionDeleting"
      @cancel="selectionStore.cancel"
      @delete="deleteSelected"
      @toggle-all="selectionStore.toggleAll"
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
