<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import TransactionDaySection from '../components/home/TransactionDaySection.vue'
import TransactionSearchBar from '../components/search/TransactionSearchBar.vue'
import TransactionSearchSummary from '../components/search/TransactionSearchSummary.vue'
import TransactionDetailSheet from '../components/detail/TransactionDetailSheet.vue'
import type { TransactionDraft, TransactionView } from '../models/transaction'
import { groupTransactionsByDay } from '../services/transaction_aggregator'
import { searchTransactions } from '../services/transaction_search'
import { useTransactionDetailStore } from '../stores/use_transaction_detail_store'
import { useTransactionEditorStore } from '../stores/use_transaction_editor_store'
import { useTransactionStore } from '../stores/use_transaction_store'

const route = useRoute()
const store = useTransactionStore()
const editorStore = useTransactionEditorStore()
const detailStore = useTransactionDetailStore()
const { transactions, accounts, categories, privacyMode, error } = storeToRefs(store)
const {
  selectedTransaction,
  saving: savingDetail,
  error: detailError,
} = storeToRefs(detailStore)

const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const results = computed(() =>
  query.value.trim()
    ? searchTransactions(transactions.value, query.value)
    : transactions.value.slice(0, 20),
)
const groupedResults = computed(() => groupTransactionsByDay(results.value))
const resultExpense = computed(() => sumFlow(results.value, 'EXPENSE'))
const resultIncome = computed(() => sumFlow(results.value, 'INCOME'))
const displayAmount = (amount: number) => store.displayAmount(amount)

watch(
  () => route.query.q,
  (value) => {
    if (typeof value === 'string') query.value = value
  },
)

onMounted(() => store.initialize())

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

function sumFlow(rows: TransactionView[], flowType: 'EXPENSE' | 'INCOME'): number {
  return Math.round(
    rows
      .filter((transaction) => transaction.flowType === flowType)
      .reduce((total, transaction) => total + transaction.amount, 0) * 100,
  ) / 100
}
</script>

<template>
  <div class="search-page">
    <TransactionSearchBar v-model="query" :result-count="results.length" />
    <TransactionSearchSummary
      :expense="resultExpense"
      :income="resultIncome"
      :privacy-mode="privacyMode"
      :result-count="results.length"
    />

    <p v-if="error || detailError" class="form-error">{{ error || detailError }}</p>
    <div v-if="groupedResults.length === 0" class="empty-result">
      <span>⌕</span>
      <strong>没有找到匹配流水</strong>
      <p>尝试搜索商户、分类、账户、金额或日期。</p>
    </div>
    <TransactionDaySection
      v-for="group in groupedResults"
      v-else
      :key="group.dateKey"
      :display-amount="displayAmount"
      :group="group"
      :privacy-mode="privacyMode"
      @select="detailStore.open"
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
  </div>
</template>

<style scoped>
.search-page {
  display: grid;
  gap: 12px;
}

.form-error {
  margin: 0;
  color: var(--danger);
  font-size: 0.7rem;
}

.empty-result {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 48px 20px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
  text-align: center;
}

.empty-result > span {
  font-size: 2rem;
}

.empty-result strong {
  font-size: 0.84rem;
}

.empty-result p {
  margin: 0;
  color: var(--muted);
  font-size: 0.67rem;
}
</style>
