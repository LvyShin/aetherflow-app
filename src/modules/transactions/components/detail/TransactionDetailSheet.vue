<script setup lang="ts">
import { toRef } from 'vue'
import type { AccountEntity } from '../../../accounts/models/account'
import type { CategoryEntity } from '../../../categories/models/category'
import BaseSheet from '../../../../shared/components/BaseSheet.vue'
import AppIcon from '../../../../shared/components/AppIcon.vue'
import type { TransactionDraft, TransactionView } from '../../models/transaction'
import { useTransactionDetailForm } from '../../composables/use_transaction_detail_form'
import TransactionCategoryEditor from './TransactionCategoryEditor.vue'
import TransactionDetailActions from './TransactionDetailActions.vue'
import TransactionDetailList from './TransactionDetailList.vue'

const props = defineProps<{
  transaction: TransactionView
  accounts: AccountEntity[]
  categories: CategoryEntity[]
  saving?: boolean
}>()

const emit = defineEmits<{
  close: []
  delete: []
  edit: [transaction: TransactionView]
  save: [draft: TransactionDraft]
}>()

const {
  editingField,
  draft,
  primaryCategories,
  subcategories,
  selectedPrimaryId,
  dateText,
  sign,
  selectPrimary,
  buildDraft,
} = useTransactionDetailForm({
  transaction: toRef(props, 'transaction'),
  accounts: toRef(props, 'accounts'),
  categories: toRef(props, 'categories'),
})

function saveChanges(): void {
  editingField.value = null
  emit('save', buildDraft())
}

function requestDelete(): void {
  if (window.confirm('确定删除这笔流水吗？删除后会同步影响本月统计。')) emit('delete')
}
</script>

<template>
  <BaseSheet :open="true" label="记账详情" content-class="detail-sheet" @close="emit('close')">
    <header class="sheet-header">
      <button class="icon-button" aria-label="关闭详情" @click="emit('close')">
        <AppIcon name="back" />
      </button>
      <h2>记账详情</h2>
      <button class="icon-button" aria-label="关闭详情" @click="emit('close')">
        <AppIcon name="close" />
      </button>
    </header>

    <div class="detail-card">
      <button
        class="category-hero"
        type="button"
        @click="editingField = editingField === 'category' ? null : 'category'"
      >
        <span class="category-emoji">{{ transaction.categoryIcon }}</span>
        <span class="category-path">
          {{ transaction.primaryCategoryName }}
          <template v-if="transaction.subcategoryName">
            <span>›</span> {{ transaction.subcategoryName }}
          </template>
        </span>
      </button>

      <TransactionCategoryEditor
        v-if="editingField === 'category'"
        v-model:selected-category-id="draft.categoryId"
        :primary-categories="primaryCategories"
        :selected-primary-id="selectedPrimaryId"
        :subcategories="subcategories"
        @select-primary="selectPrimary"
      />

      <button class="amount-display" type="button" @click="editingField = 'amount'">
        <span :class="{ income: transaction.flowType === 'INCOME' }">
          {{ sign }}¥{{ transaction.amount.toFixed(2) }}
        </span>
        <AppIcon name="pencil" :size="16" />
      </button>

      <div v-if="editingField === 'amount'" class="inline-editor amount-editor">
        <label>
          金额
          <span class="money-input">
            <span>¥</span>
            <input v-model.number="draft.amount" inputmode="decimal" min="0.01" step="0.01" type="number" />
          </span>
        </label>
      </div>

      <TransactionDetailList
        v-model:account-id="draft.accountId"
        v-model:editing-field="editingField"
        v-model:merchant="draft.merchant"
        :accounts="accounts"
        :date-text="dateText"
        :source-tag="transaction.sourceTag"
      />

      <div v-if="editingField" class="inline-actions">
        <button class="text-button" type="button" @click="editingField = null">取消</button>
        <button class="primary-small" type="button" :disabled="saving" @click="saveChanges">
          {{ saving ? '保存中…' : '保存修改' }}
        </button>
      </div>

      <TransactionDetailActions @delete="requestDelete" @edit="emit('edit', transaction)" />
    </div>
  </BaseSheet>
</template>

<style scoped>
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sheet-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.icon-button {
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

.detail-card {
  padding: 20px 18px 0;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
}

.category-hero {
  display: grid;
  justify-items: center;
  gap: 8px;
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.category-emoji {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: #fff4e8;
  font-size: 1.8rem;
}

.category-path {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text);
  font-size: 0.78rem;
  font-weight: 750;
}

.category-path span {
  color: var(--muted);
}

.amount-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin: 11px 0 17px;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.amount-display span {
  color: var(--text);
  font-size: 2.15rem;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.amount-display span.income {
  color: var(--income);
}

.inline-editor {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 12px 0;
  padding: 12px;
  border-radius: 14px;
  background: var(--surface-soft);
}

.inline-editor label {
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 0.63rem;
  font-weight: 650;
}

.money-input {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 9px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
}

.money-input input {
  min-width: 0;
  width: 100%;
  padding: 8px 9px 8px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 0.72rem;
}

.inline-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 0;
}

.text-button,
.primary-small {
  padding: 8px 14px;
  border: 0;
  border-radius: 11px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 700;
}

.text-button {
  background: transparent;
  color: var(--muted);
}

.primary-small {
  background: var(--primary);
  color: white;
}

@media (prefers-color-scheme: dark) {
  .category-emoji {
    background: #302719;
  }
}
</style>
