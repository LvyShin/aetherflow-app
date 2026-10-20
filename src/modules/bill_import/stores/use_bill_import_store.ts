import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useTransactionStore } from '../../transactions/stores/use_transaction_store'
import type {
  BillImportCommitResult,
  BillImportPreview,
  BillImportRowView,
} from '../models/bill_import'
import { BillImportParser } from '../services/bill_import_parser'
import { toTransactionDraft } from '../services/commit_mapper'

const parser = new BillImportParser()

export const useBillImportStore = defineStore('bill-import', () => {
  const transactionStore = useTransactionStore()
  const preview = ref<BillImportPreview | null>(null)
  const result = ref<BillImportCommitResult | null>(null)
  const parsing = ref(false)
  const importing = ref(false)
  const error = ref('')

  const existingExternalIds = computed(
    () =>
      new Set(
        transactionStore.transactions
          .map((transaction) => transaction.externalId)
          .filter((externalId): externalId is string => Boolean(externalId)),
      ),
  )
  const rows = computed<BillImportRowView[]>(() =>
    (preview.value?.rows ?? []).map((row) => ({
      ...row,
      duplicate: existingExternalIds.value.has(row.externalId),
      draft: toTransactionDraft(row, 'preview'),
    })),
  )
  const duplicateCount = computed(() => rows.value.filter((row) => row.duplicate).length)
  const importableCount = computed(() => rows.value.length - duplicateCount.value)

  async function parseFile(file: File): Promise<void> {
    parsing.value = true
    error.value = ''
    result.value = null
    try {
      await transactionStore.initialize()
      preview.value = await parser.parse(file)
    } catch (reason) {
      preview.value = null
      error.value = reason instanceof Error ? reason.message : '账单解析失败'
      throw reason
    } finally {
      parsing.value = false
    }
  }

  async function commitImport(): Promise<BillImportCommitResult | null> {
    if (!preview.value) return null
    importing.value = true
    error.value = ''
    try {
      const batchId = crypto.randomUUID()
      const drafts = preview.value.rows.map((row) => toTransactionDraft(row, batchId))
      const imported = await transactionStore.importTransactions(drafts, batchId)
      result.value = {
        ...imported,
        total: preview.value.rows.length,
        skipped: preview.value.skippedRows,
      }
      return result.value
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : '账单写入失败'
      throw reason
    } finally {
      importing.value = false
    }
  }

  function reset(): void {
    preview.value = null
    result.value = null
    error.value = ''
  }

  return {
    preview,
    result,
    rows,
    parsing,
    importing,
    error,
    duplicateCount,
    importableCount,
    parseFile,
    commitImport,
    reset,
  }
})
