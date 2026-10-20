import { describe, expect, it } from 'vitest'
import type { TransactionView } from '../models/transaction'
import {
  formatMonthLabel,
  getMonthRange,
  getYesterday,
  resolveVisibleMonth,
  selectTransactionsForDay,
} from './transaction_date'

describe('transaction date selectors', () => {
  it('finds yesterday across a month boundary', () => {
    expect(getYesterday(new Date(2026, 10, 1, 8)).getTime()).toBe(
      new Date(2026, 9, 31).getTime(),
    )
  })

  it('selects only transactions from the requested local day', () => {
    const rows = [
      transaction('yesterday', new Date(2026, 9, 19, 8).getTime()),
      transaction('today', new Date(2026, 9, 20, 8).getTime()),
    ]

    expect(selectTransactionsForDay(rows, new Date(2026, 9, 19)).map((row) => row.id)).toEqual([
      'yesterday',
    ])
  })

  it('resolves the visible month from the earliest visible transaction', () => {
    expect(
      resolveVisibleMonth(
        new Date(2026, 8, 30, 23).getTime(),
        new Date(2026, 9, 2).getTime(),
      ),
    ).toBe('2026-09')
  })

  it('formats month labels and builds local month ranges', () => {
    expect(formatMonthLabel('2026-10')).toBe('2026 年 10 月')

    const range = getMonthRange('2026-10')
    expect(range.start.getTime()).toBe(new Date(2026, 9, 1).getTime())
    expect(range.end.getTime()).toBe(new Date(2026, 10, 1).getTime())
  })
})

function transaction(id: string, transactedAt: number): TransactionView {
  return {
    id,
    accountId: 'account:wechat',
    categoryId: 'category:expense:food:0',
    amount: 10,
    flowType: 'EXPENSE',
    transactedAt,
    merchant: id,
    remark: '',
    sourceTag: '账单导入',
    isVehicleExpense: false,
    vehicleId: null,
    externalId: id,
    importBatchId: 'batch',
    createdAt: 1,
    updatedAt: 1,
    version: 1,
    accountName: '微信支付',
    categoryName: '餐饮',
    categoryIcon: '🍔',
    primaryCategoryId: 'category:expense:food',
    primaryCategoryName: '餐饮',
    subcategoryName: '早午晚餐',
  }
}
