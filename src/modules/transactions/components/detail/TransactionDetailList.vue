<script setup lang="ts">
import type { AccountEntity } from '../../../accounts/models/account'
import type { DetailEditingField } from '../../composables/use_transaction_detail_form'

defineProps<{
  accounts: AccountEntity[]
  accountId: string
  dateText: string
  sourceTag: string
}>()

const editingField = defineModel<DetailEditingField>('editingField', { required: true })
const merchant = defineModel<string>('merchant', { required: true })
const accountModel = defineModel<string>('accountId', { required: true })
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>记录时间</dt>
      <dd class="mono">{{ dateText }}</dd>
    </div>
    <div class="detail-row-action" @click="editingField = editingField === 'account' ? null : 'account'">
      <dt>来源</dt>
      <dd v-if="editingField !== 'account'">{{ sourceTag }} <span>›</span></dd>
      <dd v-else>
        <select v-model="accountModel">
          <option v-for="account in accounts" :key="account.id" :value="account.id">
            {{ account.name }}
          </option>
        </select>
      </dd>
    </div>
    <div class="detail-row-action" @click="editingField = 'merchant'">
      <dt>备注</dt>
      <dd v-if="editingField !== 'merchant'">
        {{ merchant || '未填写商户' }}
        <span class="pencil">✎</span>
      </dd>
      <dd v-else class="merchant-editor">
        <input v-model="merchant" autofocus maxlength="80" />
      </dd>
    </div>
    <div>
      <dt>凭证图片</dt>
      <dd>
        <button class="image-placeholder" type="button" title="图片功能将在本地附件模块中接入">
          <span>＋</span>
          <small>0/4</small>
        </button>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.detail-list {
  margin: 0;
  border-top: 1px solid var(--line);
}

.detail-list > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 47px;
  border-bottom: 1px solid var(--line);
  font-size: 0.7rem;
}

dt {
  flex: 0 0 auto;
  color: var(--muted);
}

dd {
  min-width: 0;
  margin: 0;
  color: var(--muted-strong);
  font-weight: 650;
  text-align: right;
  overflow-wrap: anywhere;
}

.detail-row-action {
  cursor: pointer;
}

dd span {
  margin-left: 4px;
  color: var(--muted);
}

.pencil {
  color: var(--muted);
}

.merchant-editor {
  width: 62%;
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

.mono {
  font-family: "SFMono-Regular", Consolas, monospace;
}

.image-placeholder {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 5px;
  border: 0;
  border-radius: 11px;
  background: var(--surface-soft);
  color: var(--muted);
  cursor: help;
}

.image-placeholder small {
  font-size: 0.52rem;
}
</style>
