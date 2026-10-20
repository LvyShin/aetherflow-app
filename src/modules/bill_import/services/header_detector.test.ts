import { describe, expect, it } from 'vitest'
import { detectBillHeader } from './header_detector'

describe('detectBillHeader', () => {
  it('skips WeChat preamble rows and locates the real header', () => {
    const matrix = [
      ['微信支付账单明细'],
      ['导出时间', '2026-10-20'],
      [],
      ['交易时间', '交易类型', '交易对方', '商品', '收/支', '金额(元)', '支付方式', '当前状态', '交易单号'],
      ['2026-10-19 18:34:00', '商户消费', '好鲜生', '蔬菜', '支出', '¥2.00', '零钱', '支付成功', 'wx-001'],
    ]

    const detection = detectBillHeader(matrix, '微信支付账单.csv')

    expect(detection).toMatchObject({
      headerIndex: 3,
      channel: 'WECHAT',
      columns: { time: 0, peer: 2, goods: 3, flow: 4, amount: 5, transactionId: 8 },
    })
  })

  it('recognizes Alipay files by file name', () => {
    const matrix = [
      ['交易时间', '交易对方', '商品说明', '收/支', '金额', '交易状态', '交易订单号'],
    ]

    expect(detectBillHeader(matrix, '支付宝交易明细.csv')?.channel).toBe('ALIPAY')
  })
})
