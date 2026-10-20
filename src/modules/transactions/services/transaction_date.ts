import type { TransactionView } from '../models/transaction'

export function getYesterday(referenceDate = new Date()): Date {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - 1)
}

export function selectTransactionsForDay(
  transactions: TransactionView[],
  date: Date,
): TransactionView[] {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.transactedAt)
    return (
      transactionDate.getFullYear() === date.getFullYear() &&
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getDate() === date.getDate()
    )
  })
}

export function formatDayLabel(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/** 由流水的时间范围推到出当前浏览的月份（YYYY-MM），用于月份粘性标题。 */
export function resolveVisibleMonth(
  firstDate: number | null,
  lastDate: number | null,
  fallback = new Date(),
): string {
  const source = firstDate ?? lastDate ?? fallback.getTime()
  const date = new Date(source)
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0')].join('-')
}

/** 将 YYYY-MM 转成「2026 年 10 月」的展示文案。 */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return `${year} 年 ${month} 月`
}

/** 生成一个月的开始与结束时间（本地时区）。 */
export function getMonthRange(monthKey: string): { start: Date; end: Date } {
  const [year, month] = monthKey.split('-').map(Number)
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1),
  }
}
