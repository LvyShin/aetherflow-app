<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from './shared/components/AppHeader.vue'
import AppToast from './shared/components/AppToast.vue'
import BottomNavigation from './shared/components/BottomNavigation.vue'
import { useAppToast } from './shared/composables/use_app_toast'
import TransactionEditorSheet from './modules/transactions/components/editor/TransactionEditorSheet.vue'
import { useTransactionEditorStore } from './modules/transactions/stores/use_transaction_editor_store'
import { useTransactionStore } from './modules/transactions/stores/use_transaction_store'

const transactionStore = useTransactionStore()
const editorStore = useTransactionEditorStore()
const { accounts, categories } = storeToRefs(transactionStore)
const { open, transaction, saving } = storeToRefs(editorStore)
const toast = useAppToast()

onMounted(() => transactionStore.initialize())

async function saveTransaction(draft: Parameters<typeof editorStore.save>[0]): Promise<void> {
  try {
    toast.show(await editorStore.save(draft))
  } catch (reason) {
    toast.show(reason instanceof Error ? reason.message : '流水保存失败')
  }
}
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <RouterView />
    </main>
    <BottomNavigation @record="editorStore.openCreate" />
    <TransactionEditorSheet
      :accounts="accounts"
      :categories="categories"
      :open="open"
      :saving="saving"
      :transaction="transaction"
      @close="editorStore.close"
      @save="saveTransaction"
    />
    <AppToast :message="toast.message.value" />
  </div>
</template>
