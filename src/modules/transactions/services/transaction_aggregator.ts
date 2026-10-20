import type {
  TransactionGroup,
  TransactionTotals,
  TransactionView,
} from '../models/transaction'

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function calculateTransactionTotals(
  transactions: TransactionView[],
  start: Date,
  end: Date,
): TransactionTotals {
  const startTime = start.getTime()
  const endTime = end.getTime()
  let expense = 0
  let income = 0

  for (const transaction of transactions) {
    if (transaction.transactedAt < startTime || transaction.transactedAt >= endTime) continue
    if (transaction.flowType === 'EXPENSE') expense += transaction.amount
    if (transaction.flowType === 'INCOME') income += transaction.amount
  }

  return {
    expense: roundMoney(expense),
    income: roundMoney(income),
    balance: roundMoney(income - expense),
  }
}

export function groupTransactionsByDay(
  transactions: TransactionView[],
  today = new Date(),
): TransactionGroup[] {
  const groups = new Map<string, TransactionView[]>()
  for (const transaction of transactions) {
    const dateKey = formatDateKey(new Date(transaction.transactedAt))
    const items = groups.get(dateKey) ?? []
    items.push(transaction)
    groups.set(dateKey, items)
  }

  return [...groups.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([dateKey, items]) => buildGroup(dateKey, items, today))
}

export function formatDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function buildGroup(
  dateKey: string,
  items: TransactionView[],
  today: Date,
): TransactionGroup {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const expense = items
    .filter((item) => item.flowType === 'EXPENSE')
    .reduce((total, item) => total + item.amount, 0)
  const income = items
    .filter((item) => item.flowType === 'INCOME')
    .reduce((total, item) => total + item.amount, 0)

  return {
    dateKey,
    dateLabel: formatDateLabel(date, today),
    expense: roundMoney(expense),
    income: roundMoney(income),
    items,
  }
}

function formatDateLabel(date: Date, today: Date): string {
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  const dateText = `${date.getMonth() + 1}月${date.getDate()}日`
  if (isSameDay(date, today)) return `今天 · ${dateText}`
  if (isSameDay(date, yesterday)) return `昨天 · ${dateText}`
  return `${dateText} · 星期${'日一二三四五六'[date.getDay()]}`
}

function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}
