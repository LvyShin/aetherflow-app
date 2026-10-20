import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { AccountEntity } from '../../accounts/models/account'
import type { CategoryEntity } from '../../categories/models/category'
import { getChildCategories, getPrimaryCategories } from '../../categories/utils/category_tree'
import type { TransactionDraft, TransactionView } from '../models/transaction'

export type DetailEditingField = 'amount' | 'merchant' | 'category' | 'account' | null

interface DetailFormOptions {
  transaction: Ref<TransactionView>
  accounts: Ref<AccountEntity[]>
  categories: Ref<CategoryEntity[]>
}

export function useTransactionDetailForm(options: DetailFormOptions) {
  const editingField = ref<DetailEditingField>(null)
  const draft = reactive<TransactionDraft>({
    accountId: '',
    categoryId: '',
    amount: 0,
    flowType: 'EXPENSE',
    transactedAt: 0,
    merchant: '',
    remark: '',
    sourceTag: '',
  })

  const primaryCategories = computed(() =>
    getPrimaryCategories(options.categories.value, draft.flowType),
  )
  const selectedCategory = computed(() =>
    options.categories.value.find((category) => category.id === draft.categoryId),
  )
  const selectedPrimaryId = computed(() =>
    selectedCategory.value?.parentId ?? selectedCategory.value?.id ?? '',
  )
  const subcategories = computed(() =>
    selectedPrimaryId.value ? getChildCategories(options.categories.value, selectedPrimaryId.value) : [],
  )
  const dateText = computed(() => formatDateTime(options.transaction.value.transactedAt))
  const sign = computed(() => (options.transaction.value.flowType === 'INCOME' ? '+' : '-'))

  watch(
    () => options.transaction.value,
    (transaction) => {
      Object.assign(draft, toDraft(transaction))
      editingField.value = null
    },
    { immediate: true },
  )

  function selectPrimary(primaryId: string): void {
    draft.categoryId =
      getChildCategories(options.categories.value, primaryId)[0]?.id ?? primaryId
  }

  function buildDraft(): TransactionDraft {
    const account = options.accounts.value.find((candidate) => candidate.id === draft.accountId)
    return {
      ...draft,
      amount: Math.max(0.01, Math.round(Number(draft.amount) * 100) / 100),
      sourceTag: account?.name ?? draft.sourceTag,
    }
  }

  return {
    editingField,
    draft,
    primaryCategories,
    subcategories,
    selectedPrimaryId,
    dateText,
    sign,
    selectPrimary,
    buildDraft,
  }
}

function toDraft(transaction: TransactionView): TransactionDraft {
  return {
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    amount: transaction.amount,
    flowType: transaction.flowType === 'INCOME' ? 'INCOME' : 'EXPENSE',
    transactedAt: transaction.transactedAt,
    merchant: transaction.merchant,
    remark: transaction.remark,
    sourceTag: transaction.sourceTag,
    isVehicleExpense: transaction.isVehicleExpense,
    vehicleId: transaction.vehicleId,
  }
}

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
