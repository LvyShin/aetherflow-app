import { describe, expect, it } from 'vitest'
import { detectBillHeader } from './header_detector'
import { mapBillRows } from './bill_row_mapper'

describe('mapBillRows', () => {
  it('normalizes WeChat rows and ignores refunded transactions', async () => {
    const matrix = [
      ['微信支付账单明细'],
      ['交易时间', '交易对方', '商品', '收/支', '金额(元)', '支付方式', '当前状态', '交易单号'],
      ['2026-10-19 18:34:00', '好鲜生', '蔬菜', '支出', '¥2.00', '零钱', '支付成功', 'wx-001'],
      ['2026-10-19 10:00:00', '工资公司', '工资', '收入', '4,922.43', '招商银行卡', '已到账', 'wx-002'],
      ['2026-10-18 09:00:00', '退款商户', '退款', '收入', '8.00', '零钱', '已退款', 'wx-003'],
    ]
    const detection = detectBillHeader(matrix, '微信支付账单.xlsx')
    expect(detection).not.toBeNull()

    const result = await mapBillRows(matrix, detection!)

    expect(result.issues).toHaveLength(0)
    expect(result.skippedRows).toBe(1)
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]).toMatchObject({
      amount: 2,
      flowType: 'EXPENSE',
      merchant: '好鲜生',
      categoryName: '餐饮',
      accountId: 'account:wechat',
      rawTransactionId: 'wx-001',
    })
    expect(result.rows[1]).toMatchObject({
      amount: 4922.43,
      flowType: 'INCOME',
      categoryName: '薪资',
      accountId: 'account:bank',
    })
    expect(result.rows[0]?.externalId).toMatch(/^[a-f0-9]{64}$/)
  })

  it('reports invalid rows without aborting the valid import', async () => {
    const matrix = [
      ['交易时间', '交易对方', '收/支', '金额', '交易状态', '交易订单号'],
      ['不是时间', '坏数据', '支出', '12.00', '支付成功', 'ali-001'],
      ['2026-10-01 12:00:00', '淘宝', '支出', '14.52', '支付成功', 'ali-002'],
    ]
    const detection = detectBillHeader(matrix, '支付宝账单.csv')

    const result = await mapBillRows(matrix, detection!)

    expect(result.rows).toHaveLength(1)
    expect(result.skippedRows).toBe(0)
    expect(result.issues).toEqual([{ row: 2, message: '交易时间格式无法识别' }])
    expect(result.rows[0]?.categoryName).toBe('购物')
  })

  it('does not treat neutral cash flows as income', async () => {
    const matrix = [
      ['交易时间', '交易对方', '收/支', '金额', '交易状态', '交易订单号'],
      ['2026-10-01 12:00:00', '账户间转账', '不计收支', '100.00', '支付成功', 'ali-neutral-001'],
      ['2026-10-01 13:00:00', '收款方', '收入', '50.00', '支付成功', 'ali-income-001'],
    ]
    const detection = detectBillHeader(matrix, '支付宝账单.csv')

    const result = await mapBillRows(matrix, detection!)

    expect(result.rows).toHaveLength(1)
    expect(result.skippedRows).toBe(1)
    expect(result.rows[0]).toMatchObject({ flowType: 'INCOME', amount: 50 })
  })
})
