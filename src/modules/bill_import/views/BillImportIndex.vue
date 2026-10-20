<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BillImportFilePicker from '../components/BillImportFilePicker.vue'
import BillImportGuide from '../components/BillImportGuide.vue'
import BillImportIssueList from '../components/BillImportIssueList.vue'
import BillImportPreviewList from '../components/BillImportPreviewList.vue'
import BillImportResultCard from '../components/BillImportResultCard.vue'
import BillImportSummaryCard from '../components/BillImportSummaryCard.vue'
import { useBillImportStore } from '../stores/use_bill_import_store'

const store = useBillImportStore()
const {
  preview,
  result,
  rows,
  parsing,
  importing,
  error,
  duplicateCount,
  importableCount,
} = storeToRefs(store)

async function selectFile(file: File): Promise<void> {
  try {
    await store.parseFile(file)
  } catch {
    // 错误信息由 Store 统一展示。
  }
}

async function commitImport(): Promise<void> {
  try {
    await store.commitImport()
  } catch {
    // 错误信息由 Store 统一展示。
  }
}
</script>

<template>
  <div class="bill-import-page">
    <BillImportGuide />

    <BillImportResultCard v-if="result" :result="result" @reset="store.reset" />

    <template v-else-if="preview">
      <BillImportSummaryCard
        :duplicate-count="duplicateCount"
        :importable-count="importableCount"
        :preview="preview"
      />
      <BillImportPreviewList :rows="rows" />
      <BillImportIssueList :issues="preview.issues" />
      <p v-if="error" class="form-error">{{ error }}</p>
      <div class="import-actions">
        <button class="secondary-button" type="button" :disabled="importing" @click="store.reset">
          重新选择
        </button>
        <button
          class="primary-button"
          type="button"
          :disabled="importing || importableCount === 0"
          @click="commitImport"
        >
          {{ importing ? '正在写入本地账本…' : importableCount ? `确认导入 ${importableCount} 笔` : '没有可导入流水' }}
        </button>
      </div>
    </template>

    <template v-else>
      <BillImportFilePicker :parsing="parsing" @select="selectFile" />
      <p v-if="error" class="form-error">{{ error }}</p>
    </template>
  </div>
</template>

<style scoped>
.bill-import-page {
  display: grid;
  gap: 14px;
}

.form-error {
  margin: 0;
  padding: 11px 13px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--danger) 9%, var(--surface));
  color: var(--danger);
  font-size: 0.68rem;
  font-weight: 650;
}

.import-actions {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 9px;
}

.secondary-button,
.primary-button {
  min-height: 44px;
  border: 0;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 750;
}

.secondary-button {
  background: var(--surface);
  color: var(--muted-strong);
}

.primary-button {
  background: var(--primary);
  color: white;
  box-shadow: 0 9px 20px rgba(56, 85, 224, 0.24);
}
</style>
