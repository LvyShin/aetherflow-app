import type { TransactionDraft } from '../models/transaction'

export function normalizeTransactionDraft(draft: TransactionDraft): TransactionDraft {
  const amount = roundMoney(Number(draft.amount))
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('金额必须大于 0')
  if (!draft.categoryId) throw new Error('请选择记账分类')
  if (!draft.accountId) throw new Error('请选择支付账户')
  if (!Number.isFinite(draft.transactedAt)) throw new Error('请选择有效记账时间')

  return {
    ...draft,
    amount,
    merchant: draft.merchant.trim() || '未填写商户',
    remark: draft.remark.trim(),
    sourceTag: draft.sourceTag.trim() || '手动记账',
    vehicleId: draft.vehicleId ?? null,
  }
}

function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}
