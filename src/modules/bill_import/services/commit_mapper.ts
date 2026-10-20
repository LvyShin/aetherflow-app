import type { TransactionDraft } from '../../transactions/models/transaction'
import type { ParsedBillRow } from '../models/bill_import'

export function toTransactionDraft(
  row: ParsedBillRow,
  importBatchId: string,
): TransactionDraft {
  return {
    accountId: row.accountId,
    categoryId: row.categoryId,
    amount: row.amount,
    flowType: row.flowType,
    transactedAt: row.transactedAt,
    merchant: row.merchant,
    remark: row.rawTransactionId ? `原交易单号：${row.rawTransactionId}` : '',
    sourceTag: row.sourceTag,
    externalId: row.externalId,
    importBatchId,
  }
}
