import { describe, expect, it } from 'vitest'
import type { TransactionDraft } from '../models/transaction'
import { normalizeTransactionDraft } from './transaction_validator'

const validDraft: TransactionDraft = {
  accountId: 'account:wechat',
  categoryId: 'category:expense:food:0',
  amount: 12.345,
  flowType: 'EXPENSE',
  transactedAt: 1,
  merchant: '  测试商户  ',
  remark: '  备注  ',
  sourceTag: '  微信支付  ',
}

describe('normalizeTransactionDraft', () => {
  it('normalizes money and text values', () => {
    expect(normalizeTransactionDraft(validDraft)).toMatchObject({
      amount: 12.35,
      merchant: '测试商户',
      remark: '备注',
      sourceTag: '微信支付',
    })
  })

  it('rejects non-positive amounts', () => {
    expect(() => normalizeTransactionDraft({ ...validDraft, amount: 0 })).toThrow('金额必须大于 0')
  })
})
