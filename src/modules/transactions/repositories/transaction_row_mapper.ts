import type { TransactionView } from '../models/transaction'

export interface TransactionRow {
  id: string
  account_id: string
  category_id: string
  amount: number
  flow_type: TransactionView['flowType']
  transacted_at: number
  merchant: string | null
  remark: string | null
  source_tag: string | null
  is_vehicle_expense: number
  vehicle_id: string | null
  created_at: number
  updated_at: number
  version: number
  account_name: string
  category_name: string
  category_icon: string
  primary_category_id: string
  primary_category_name: string
  subcategory_name: string
}

export function mapTransactionRow(row: TransactionRow): TransactionView {
  return {
    id: row.id,
    accountId: row.account_id,
    categoryId: row.category_id,
    amount: row.amount,
    flowType: row.flow_type,
    transactedAt: row.transacted_at,
    merchant: row.merchant ?? '',
    remark: row.remark ?? '',
    sourceTag: row.source_tag ?? '',
    isVehicleExpense: Boolean(row.is_vehicle_expense),
    vehicleId: row.vehicle_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
    accountName: row.account_name,
    categoryName: row.category_name,
    categoryIcon: row.category_icon || '🏷️',
    primaryCategoryId: row.primary_category_id,
    primaryCategoryName: row.primary_category_name,
    subcategoryName: row.subcategory_name,
  }
}
