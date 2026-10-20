import { describe, expect, it } from 'vitest'
import type { TransactionView } from '../models/transaction'
import { searchTransactions } from './transaction_search'

const rows: TransactionView[] = [
  transaction({
    id: 'food',
    merchant: '小巷咖啡',
    primaryCategoryName: '餐饮',
    subcategoryName: '咖啡奶茶',
    amount: 18.5,
  }),
  transaction({
    id: 'shopping',
    merchant: '永辉超市',
    primaryCategoryName: '购物',
    subcategoryName: '日用百货',
    amount: 83.8,
  }),
  transaction({
    id: 'income',
    merchant: '工资入账',
    flowType: 'INCOME',
    accountName: '招商银行卡',
    amount: 4922.43,
    transactedAt: new Date(2026, 8, 18, 12, 0).getTime(),
  }),
]

describe('searchTransactions', () => {
  it('searches merchant, category, account and amount', () => {
    expect(searchTransactions(rows, '咖啡').map((row) => row.id)).toEqual(['food'])
    expect(searchTransactions(rows, '购物').map((row) => row.id)).toEqual(['shopping'])
    expect(searchTransactions(rows, '招商银行卡 收入').map((row) => row.id)).toEqual(['income'])
    expect(searchTransactions(rows, '83.80').map((row) => row.id)).toEqual(['shopping'])
  })

  it('supports date text and returns all rows for a blank query', () => {
    expect(searchTransactions(rows, '9月18日').map((row) => row.id)).toEqual(['income'])
    expect(searchTransactions(rows, '  ')).toHaveLength(rows.length)
  })
})

function transaction(overrides: Partial<TransactionView>): TransactionView {
  return {
    id: 'transaction',
    accountId: 'account:wechat',
    categoryId: 'category:expense:food:0',
    amount: 10,
    flowType: 'EXPENSE',
    transactedAt: new Date(2026, 9, 20, 12, 0).getTime(),
    merchant: '测试商户',
    remark: '',
    sourceTag: '微信支付',
    isVehicleExpense: false,
    vehicleId: null,
    externalId: null,
    importBatchId: null,
    createdAt: 1,
    updatedAt: 1,
    version: 1,
    accountName: '微信支付',
    categoryName: '餐饮',
    categoryIcon: '🍔',
    primaryCategoryId: 'category:expense:food',
    primaryCategoryName: '餐饮',
    subcategoryName: '早午晚餐',
    ...overrides,
  }
}
