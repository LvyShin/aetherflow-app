import type { CategoryFlowType } from '../../categories/models/category'
import type { TransactionDraft } from '../../transactions/models/transaction'

export type BillChannel = 'WECHAT' | 'ALIPAY'
export type BillFileType = 'XLSX' | 'XLS' | 'CSV'

export interface BillColumnMap {
  time: number
  type: number
  peer: number
  goods: number
  flow: number
  amount: number
  method: number
  status: number
  transactionId: number
}

export interface BillHeaderDetection {
  headerIndex: number
  columns: BillColumnMap
  channel: BillChannel
}

export interface ParsedBillRow {
  sourceRow: number
  transactedAt: number
  flowType: CategoryFlowType
  amount: number
  merchant: string
  categoryId: string
  categoryName: string
  subcategoryName: string
  accountId: string
  accountName: string
  sourceTag: string
  externalId: string
  rawTransactionId: string
}

export interface BillImportIssue {
  row: number
  message: string
}

export interface BillImportPreview {
  fileName: string
  fileType: BillFileType
  fileSize: number
  channel: BillChannel
  rows: ParsedBillRow[]
  issues: BillImportIssue[]
  skippedRows: number
  totalExpense: number
  totalIncome: number
  earliestAt: number | null
  latestAt: number | null
}

export interface BillImportCommitResult {
  inserted: number
  duplicates: number
  total: number
  skipped: number
  batchId: string
}

export interface BillImportRowView extends ParsedBillRow {
  duplicate: boolean
  draft: TransactionDraft
}
