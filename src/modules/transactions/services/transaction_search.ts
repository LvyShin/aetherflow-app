import type { TransactionView } from '../models/transaction'

export function searchTransactions(
  transactions: TransactionView[],
  rawQuery: string,
): TransactionView[] {
  const tokens = normalizeQuery(rawQuery)
  if (tokens.length === 0) return transactions
  return transactions.filter((transaction) => {
    const haystack = buildSearchText(transaction)
    return tokens.every((token) => haystack.includes(token))
  })
}

export function normalizeQuery(query: string): string[] {
  return query
    .toLocaleLowerCase('zh-CN')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function buildSearchText(transaction: TransactionView): string {
  const date = new Date(transaction.transactedAt)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [
    transaction.merchant,
    transaction.remark,
    transaction.primaryCategoryName,
    transaction.subcategoryName,
    transaction.accountName,
    transaction.sourceTag,
    transaction.flowType === 'INCOME' ? '收入' : transaction.flowType === 'TRANSFER' ? '转账' : '支出',
    transaction.amount.toFixed(2),
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`,
    `${month}月${day}日`,
  ]
    .join(' ')
    .toLocaleLowerCase('zh-CN')
}
