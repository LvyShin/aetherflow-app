import type { CategoryFlowType } from '../../categories/models/category'

export type FlowType = CategoryFlowType | 'TRANSFER'

export interface TransactionEntity {
  id: string
  accountId: string
  categoryId: string
  amount: number
  flowType: FlowType
  transactedAt: number
  merchant: string
  remark: string
  sourceTag: string
  isVehicleExpense: boolean
  vehicleId: string | null
  externalId: string | null
  importBatchId: string | null
  createdAt: number
  updatedAt: number
  version: number
}

export interface TransactionView extends TransactionEntity {
  accountName: string
  categoryName: string
  categoryIcon: string
  primaryCategoryId: string
  primaryCategoryName: string
  subcategoryName: string
}

export interface TransactionDraft {
  accountId: string
  categoryId: string
  amount: number
  flowType: CategoryFlowType
  transactedAt: number
  merchant: string
  remark: string
  sourceTag: string
  isVehicleExpense?: boolean
  vehicleId?: string | null
  externalId?: string | null
  importBatchId?: string | null
}

export interface TransactionTotals {
  expense: number
  income: number
  balance: number
}

export interface TransactionGroup {
  dateKey: string
  dateLabel: string
  expense: number
  income: number
  items: TransactionView[]
}

export interface TransactionImportResult {
  inserted: number
  duplicates: number
  batchId: string
}
