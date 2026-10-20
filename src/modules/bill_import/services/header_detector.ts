import { HEADER_ALIASES, IMPORT_HEADER_SCAN_LIMIT } from '../constants/header_keywords'
import type { BillChannel, BillColumnMap, BillHeaderDetection } from '../models/bill_import'

type Matrix = unknown[][]
type ColumnKey = keyof BillColumnMap

export function detectBillHeader(matrix: Matrix, fileName: string): BillHeaderDetection | null {
  const scanLimit = Math.min(matrix.length, IMPORT_HEADER_SCAN_LIMIT)
  for (let rowIndex = 0; rowIndex < scanLimit; rowIndex += 1) {
    const columns = createEmptyColumnMap()
    const row = matrix[rowIndex] ?? []
    row.forEach((cell, columnIndex) => {
      const normalizedCell = normalizeCell(cell)
      for (const [key, aliases] of Object.entries(HEADER_ALIASES) as Array<
        [ColumnKey, readonly string[]]
      >) {
        if (columns[key] === -1 && aliases.some((alias) => normalizedCell.includes(alias))) {
          columns[key] = columnIndex
        }
      }
    })

    if (columns.time >= 0 && columns.amount >= 0) {
      return {
        headerIndex: rowIndex,
        columns,
        channel: detectChannel(matrix, fileName),
      }
    }
  }
  return null
}

function createEmptyColumnMap(): BillColumnMap {
  return {
    time: -1,
    type: -1,
    peer: -1,
    goods: -1,
    flow: -1,
    amount: -1,
    method: -1,
    status: -1,
    transactionId: -1,
  }
}

function detectChannel(matrix: Matrix, fileName: string): BillChannel {
  const headerText = matrix
    .slice(0, IMPORT_HEADER_SCAN_LIMIT)
    .flat()
    .map(normalizeCell)
    .join(' ')
  const source = `${fileName} ${headerText}`.toLowerCase()
  if (source.includes('微信') || source.includes('wechat') || source.includes('wxpay')) {
    return 'WECHAT'
  }
  return 'ALIPAY'
}

function normalizeCell(value: unknown): string {
  return String(value ?? '').replace(/\s+/g, '').toLowerCase()
}
