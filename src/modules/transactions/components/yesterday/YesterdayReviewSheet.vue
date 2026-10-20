<script setup lang="ts">
import BaseSheet from '../../../../shared/components/BaseSheet.vue'
import AppIcon from '../../../../shared/components/AppIcon.vue'
import type { TransactionGroup, TransactionView } from '../../models/transaction'
import TransactionDaySection from '../home/TransactionDaySection.vue'

defineProps<{
  open: boolean
  dateLabel: string
  group: TransactionGroup | null
  privacyMode: boolean
  displayAmount: (amount: number) => string
}>()

defineEmits<{
  close: []
  select: [transaction: TransactionView]
  addMissing: []
}>()
</script>

<template>
  <BaseSheet :open="open" label="昨日账单" content-class="yesterday-sheet centered" @close="$emit('close')">
    <header class="sheet-header">
      <div>
        <span>账单核对</span>
        <h2>{{ dateLabel }} · 昨日</h2>
      </div>
      <button aria-label="关闭昨日账单" @click="$emit('close')">
        <AppIcon name="close" />
      </button>
    </header>

    <TransactionDaySection
      v-if="group"
      :display-amount="displayAmount"
      :group="group"
      :privacy-mode="privacyMode"
      @select="$emit('select', $event)"
    />
    <div v-else class="empty-yesterday">
      <span>🗓️</span>
      <strong>昨日没有账单记录</strong>
      <p>如果确有收支，可以现在补充。</p>
    </div>

    <footer>
      <button class="add-button" @click="$emit('addMissing')">有漏记，去补充</button>
    </footer>
  </BaseSheet>
</template>

<style scoped>
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sheet-header div {
  display: grid;
  gap: 3px;
}

.sheet-header span {
  color: var(--muted);
  font-size: 0.61rem;
}

.sheet-header h2 {
  margin: 0;
  font-size: 1rem;
}

.sheet-header button {
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

.empty-yesterday {
  display: grid;
  justify-items: center;
  gap: 7px;
  padding: 44px 20px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  text-align: center;
}

.empty-yesterday span {
  font-size: 2rem;
}

.empty-yesterday strong {
  font-size: 0.82rem;
}

.empty-yesterday p {
  margin: 0;
  color: var(--muted);
  font-size: 0.66rem;
}

footer {
  padding-top: 16px;
}

.add-button {
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 14px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-size: 0.73rem;
  font-weight: 750;
}
</style>
