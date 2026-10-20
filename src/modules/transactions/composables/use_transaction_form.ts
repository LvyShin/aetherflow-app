import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { AccountEntity } from '../../accounts/models/account'
import type { CategoryEntity, CategoryFlowType } from '../../categories/models/category'
import { getChildCategories, getPrimaryCategories } from '../../categories/utils/category_tree'
import type { TransactionDraft, TransactionView } from '../models/transaction'
import { appendAmountKey } from '../services/amount_input'

interface TransactionFormOptions {
  open: Ref<boolean>
  transaction: Ref<TransactionView | null | undefined>
  accounts: Ref<AccountEntity[]>
  categories: Ref<CategoryEntity[]>
}

export function useTransactionForm(options: TransactionFormOptions) {
  const amountText = ref('0')
  const validationError = ref('')
  const form = reactive({
    flowType: 'EXPENSE' as CategoryFlowType,
    primaryCategoryId: '',
    subcategoryId: '',
    accountId: '',
    transactedAt: Date.now(),
    merchant: '',
    remark: '',
  })

  const primaryCategories = computed(() =>
    getPrimaryCategories(options.categories.value, form.flowType),
  )
  const subcategories = computed(() =>
    getChildCategories(options.categories.value, form.primaryCategoryId),
  )
  const selectedPrimary = computed(() =>
    options.categories.value.find((category) => category.id === form.primaryCategoryId),
  )
  const localDateTime = computed({
    get: () => toDateTimeInput(form.transactedAt),
    set: (value: string) => {
      const timestamp = new Date(value).getTime()
      if (Number.isFinite(timestamp)) form.transactedAt = timestamp
    },
  })

  watch(
    () => [options.open.value, options.transaction.value] as const,
    ([open]) => {
      if (open) resetForm()
    },
    { immediate: true },
  )

  function resetForm(): void {
    validationError.value = ''
    const transaction = options.transaction.value
    if (transaction) {
      const category = options.categories.value.find((item) => item.id === transaction.categoryId)
      form.flowType = transaction.flowType === 'INCOME' ? 'INCOME' : 'EXPENSE'
      form.primaryCategoryId = category?.parentId ?? transaction.categoryId
      form.subcategoryId = category?.parentId ? category.id : ''
      form.accountId = transaction.accountId
      form.transactedAt = transaction.transactedAt
      form.merchant = transaction.merchant
      form.remark = transaction.remark
      amountText.value = transaction.amount.toFixed(2)
      return
    }

    form.flowType = 'EXPENSE'
    setDefaultCategory('EXPENSE')
    form.accountId = options.accounts.value[0]?.id ?? ''
    form.transactedAt = Date.now()
    form.merchant = ''
    form.remark = ''
    amountText.value = '0'
  }

  function setFlow(flowType: CategoryFlowType): void {
    if (form.flowType === flowType) return
    form.flowType = flowType
    setDefaultCategory(flowType)
  }

  function selectPrimary(category: CategoryEntity): void {
    form.primaryCategoryId = category.id
    form.subcategoryId = options.categories.value.find((item) => item.parentId === category.id)?.id ?? ''
  }

  function selectSubcategory(category: CategoryEntity): void {
    form.subcategoryId = category.id
  }

  function pressKey(key: string): void {
    amountText.value = appendAmountKey(amountText.value, key)
  }

  function buildDraft(): TransactionDraft | null {
    validationError.value = ''
    const amount = Number(amountText.value)
    const categoryId = form.subcategoryId || form.primaryCategoryId
    if (!Number.isFinite(amount) || amount <= 0) {
      validationError.value = '请输入大于 0 的金额'
      return null
    }
    if (!categoryId) {
      validationError.value = '请选择记账分类'
      return null
    }
    if (!form.accountId) {
      validationError.value = '请选择支付账户'
      return null
    }

    const account = options.accounts.value.find((candidate) => candidate.id === form.accountId)
    return {
      accountId: form.accountId,
      categoryId,
      amount: Math.round(amount * 100) / 100,
      flowType: form.flowType,
      transactedAt: form.transactedAt,
      merchant: form.merchant,
      remark: form.remark,
      sourceTag: account?.name ?? '手动记账',
      isVehicleExpense: options.transaction.value?.isVehicleExpense ?? false,
      vehicleId: options.transaction.value?.vehicleId ?? null,
    }
  }

  function setDefaultCategory(flowType: CategoryFlowType): void {
    const primary = getPrimaryCategories(options.categories.value, flowType)[0]
    form.primaryCategoryId = primary?.id ?? ''
    form.subcategoryId = primary
      ? getChildCategories(options.categories.value, primary.id)[0]?.id ?? ''
      : ''
  }

  return {
    amountText,
    validationError,
    form,
    primaryCategories,
    subcategories,
    selectedPrimary,
    localDateTime,
    setFlow,
    selectPrimary,
    selectSubcategory,
    pressKey,
    buildDraft,
  }
}

function toDateTimeInput(timestamp: number): string {
  const date = new Date(timestamp)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(timestamp - offset).toISOString().slice(0, 16)
}
