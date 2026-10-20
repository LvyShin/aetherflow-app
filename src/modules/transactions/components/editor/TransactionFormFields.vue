<script setup lang="ts">
import type { AccountEntity } from '../../../accounts/models/account'

defineProps<{
  accounts: AccountEntity[]
  categoryLabel: string
  amountText: string
}>()

const merchant = defineModel<string>('merchant', { required: true })
const remark = defineModel<string>('remark', { required: true })
const accountId = defineModel<string>('accountId', { required: true })
const dateTime = defineModel<string>('dateTime', { required: true })
</script>

<template>
  <div class="editor-summary">
    <div class="editor-fields">
      <label>
        <span>商户 / 备注</span>
        <input v-model="merchant" maxlength="80" placeholder="例如：早餐、超市购物" />
      </label>
      <div class="editor-meta-row">
        <label>
          <span>账户</span>
          <select v-model="accountId">
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </label>
        <label>
          <span>时间</span>
          <input v-model="dateTime" type="datetime-local" />
        </label>
      </div>
      <label>
        <span>补充备注</span>
        <input v-model="remark" maxlength="120" placeholder="可选" />
      </label>
    </div>
    <div class="amount-panel">
      <span class="selected-category">{{ categoryLabel }}</span>
      <strong>¥{{ amountText }}</strong>
    </div>
  </div>
</template>

<style scoped>
.editor-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 124px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: var(--surface);
}

.editor-fields {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 12px;
}

.editor-fields label {
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 0.63rem;
  font-weight: 650;
}

.editor-meta-row {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 6px;
}

input,
select {
  min-width: 0;
  width: 100%;
  padding: 8px 9px;
  border: 1px solid var(--line);
  border-radius: 9px;
  outline: none;
  background: var(--surface);
  color: var(--text);
  font-size: 0.72rem;
}

.amount-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding: 14px 13px;
  background: var(--surface-soft);
}

.selected-category {
  color: var(--muted);
  font-size: 0.61rem;
  font-weight: 650;
}

.amount-panel strong {
  max-width: 100%;
  overflow: hidden;
  font-size: 1.25rem;
  letter-spacing: -0.04em;
  text-overflow: ellipsis;
}

@media (max-width: 360px) {
  .editor-summary {
    grid-template-columns: 1fr 108px;
  }
}
</style>
