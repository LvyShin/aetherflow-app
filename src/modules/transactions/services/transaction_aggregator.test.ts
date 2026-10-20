import { describe, expect, it } from 'vitest'
import type { TransactionView } from '../models/transaction'
import { calculateTransactionTotals, groupTransactionsByDay } from './transaction_aggregator'

function transaction(overrides: Partial<TransactionView>): TransactionView {
  return {
    id: 'transaction-1',
    accountId: 'account:alipay',
    categoryId: 'category:expense:food:0',
    amount: 12.5,
    flowType: 'EXPENSE',
    transactedAt: new Date(2026, 9, 20, 12, 0).getTime(),
    merchant: '测试商户',
    remark: '',
    sourceTag: '支付宝',
    isVehicleExpense: false,
    vehicleId: null,
    createdAt: 1,
    updatedAt: 1,
    version: 1,
    accountName: '支付宝',
    categoryName: '餐饮',
    categoryIcon: '🍔',
    primaryCategoryId: 'category:expense:food',
    primaryCategoryName: '餐饮',
    subcategoryName: '早午晚餐',
    ...overrides,
  }
}

describe('transaction aggregator', () => {
  it('calculates expense, income and balance inside the requested range', () => {
    const rows = [
      transaction({ id: 'expense', amount: 25.25 }),
      transaction({ id: 'income', amount: 100, flowType: 'INCOME' }),
      transaction({
        id: 'outside',
        amount: 999,
        transactedAt: new Date(2026, 8, 30, 23, 59).getTime(),
      }),
    ]

    expect(
      calculateTransactionTotals(rows, new Date(2026, 9, 1), new Date(2026, 10, 1)),
    ).toEqual({ expense: 25.25, income: 100, balance: 74.75 })
  })

  it('groups and sorts transactions by natural day', () => {
    const rows = [
      transaction({ id: 'newer', transactedAt: new Date(2026, 9, 20, 18, 30).getTime() }),
      transaction({
        id: 'older',
        transactedAt: new Date(2026, 9, 19, 8, 30).getTime(),
        amount: 8,
      }),
      transaction({
        id: 'older-income',
        transactedAt: new Date(2026, 9, 19, 9, 30).getTime(),
        amount: 50,
        flowType: 'INCOME',
      }),
    ]

    const groups = groupTransactionsByDay(rows, new Date(2026, 9, 20))

    expect(groups.map((group) => group.dateKey)).toEqual(['2026-10-20', '2026-10-19'])
    expect(groups[0]?.dateLabel).toContain('今天')
    expect(groups[1]).toMatchObject({ expense: 8, income: 50 })
  })
})
