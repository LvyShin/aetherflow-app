<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { AccountEntity } from '../../../accounts/models/account'
import type { CategoryEntity, CategoryFlowType } from '../../../categories/models/category'
import BaseSheet from '../../../../shared/components/BaseSheet.vue'
import AppIcon from '../../../../shared/components/AppIcon.vue'
import type { TransactionDraft, TransactionView } from '../../models/transaction'
import { useTransactionForm } from '../../composables/use_transaction_form'
import TransactionAmountKeypad from './TransactionAmountKeypad.vue'
import TransactionCategoryPicker from './TransactionCategoryPicker.vue'
import TransactionFlowSwitch from './TransactionFlowSwitch.vue'
import TransactionFormFields from './TransactionFormFields.vue'

const props = defineProps<{
  open: boolean
  transaction?: TransactionView | null
  accounts: AccountEntity[]
  categories: CategoryEntity[]
  saving?: boolean
}>()

const emit = defineEmits<{ close: []; save: [draft: TransactionDraft] }>()

const {
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
} = useTransactionForm({
  open: toRef(props, 'open'),
  transaction: toRef(props, 'transaction'),
  accounts: toRef(props, 'accounts'),
  categories: toRef(props, 'categories'),
})

const flowModel = computed<CategoryFlowType>({
  get: () => form.flowType,
  set: setFlow,
})

const categoryLabel = computed(() =>
  selectedPrimary.value ? `${selectedPrimary.value.icon} ${selectedPrimary.value.name}` : '',
)

function submit(): void {
  const draft = buildDraft()
  if (draft) emit('save', draft)
}
</script>

<template>
  <BaseSheet :open="open" label="记一笔" content-class="editor-sheet" @close="emit('close')">
    <header class="sheet-header">
      <TransactionFlowSwitch v-model="flowModel" />
      <h2>{{ transaction ? '编辑流水' : '记一笔' }}</h2>
      <button class="close-button" aria-label="关闭" @click="emit('close')">
        <AppIcon name="close" />
      </button>
    </header>

    <TransactionCategoryPicker
      :primary-categories="primaryCategories"
      :selected-primary-id="form.primaryCategoryId"
      :selected-subcategory-id="form.subcategoryId"
      :subcategories="subcategories"
      @select-primary="selectPrimary"
      @select-subcategory="selectSubcategory"
    />

    <TransactionFormFields
      v-model:account-id="form.accountId"
      v-model:date-time="localDateTime"
      v-model:merchant="form.merchant"
      v-model:remark="form.remark"
      :accounts="accounts"
      :amount-text="amountText"
      :category-label="categoryLabel"
    />

    <p v-if="validationError" class="form-error">{{ validationError }}</p>

    <TransactionAmountKeypad
      :saving="Boolean(saving)"
      @press="pressKey"
      @save="submit"
    />
  </BaseSheet>
</template>

<style scoped>
.sheet-header {
  position: sticky;
  z-index: 2;
  top: -16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -16px -18px 13px;
  padding: 16px 18px 7px;
  background: var(--bg);
}

.sheet-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.close-button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: var(--surface);
  color: var(--muted-strong);
  cursor: pointer;
}

.form-error {
  margin: 8px 0;
  color: var(--danger);
  font-size: 0.72rem;
  font-weight: 650;
}
</style>
