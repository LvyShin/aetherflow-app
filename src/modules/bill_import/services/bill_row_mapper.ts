import type { CategoryFlowType } from '../../categories/models/category'
import { guessBillCategory } from '../../categories/services/category_guesser'
import type {
  BillChannel,
  BillImportIssue,
  BillHeaderDetection,
  ParsedBillRow,
} from '../models/bill_import'
import { parseBillAmount } from '../utils/amount'
import { parseBillTimestamp } from '../utils/datetime'
import { createBillFingerprint } from './fingerprint'

interface MappedRows {
  rows: ParsedBillRow[]
  issues: BillImportIssue[]
  skippedRows: number
}

const IGNORED_STATUS_KEYWORDS = ['退款', '关闭', '失败', '撤销', '取消']

export async function mapBillRows(
  matrix: unknown[][],
  detection: BillHeaderDetection,
): Promise<MappedRows> {
  const rows: ParsedBillRow[] = []
  const issues: BillImportIssue[] = []
  let skippedRows = 0
  const seenFingerprints = new Set<string>()

  for (let index = detection.headerIndex + 1; index < matrix.length; index += 1) {
    const row = matrix[index] ?? []
    if (row.every((cell) => String(cell ?? '').trim() === '')) continue
    const sourceRow = index + 1
    const status = readCell(row, detection.columns.status)
    const rawFlow = readCell(row, detection.columns.flow)
    if (shouldIgnoreRow(status, rawFlow)) {
      skippedRows += 1
      continue
    }

    const amount = parseBillAmount(readCell(row, detection.columns.amount))
    if (!amount) {
      issues.push({ row: sourceRow, message: '金额为空或格式无效' })
      continue
    }
    const transactedAt = parseBillTimestamp(readCell(row, detection.columns.time))
    if (!transactedAt) {
      issues.push({ row: sourceRow, message: '交易时间格式无法识别' })
      continue
    }

    const peer = readCell(row, detection.columns.peer)
    const goods = readCell(row, detection.columns.goods)
    const merchant = peer || goods || '账单交易流水'
    const flowType = parseBillFlow(rawFlow)
    if (!flowType) {
      issues.push({ row: sourceRow, message: '收支类型无法识别' })
      continue
    }
    const category = guessBillCategory(`${peer} ${goods}`, flowType)
    const account = resolveAccount(detection.channel, readCell(row, detection.columns.method))
    const rawTransactionId = readCell(row, detection.columns.transactionId)
    const externalId = await createBillFingerprint([
      detection.channel,
      rawTransactionId || 'no-transaction-id',
      transactedAt,
      amount.toFixed(2),
      flowType,
      merchant,
    ])
    if (seenFingerprints.has(externalId)) {
      issues.push({ row: sourceRow, message: '文件内存在重复流水，已跳过' })
      continue
    }
    seenFingerprints.add(externalId)

    rows.push({
      sourceRow,
      transactedAt,
      flowType,
      amount,
      merchant,
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      subcategoryName: category.subcategoryName,
      accountId: account.id,
      accountName: account.name,
      sourceTag: detection.channel === 'WECHAT' ? '微信账单导入' : '支付宝账单导入',
      externalId,
      rawTransactionId,
    })
  }

  return { rows, issues, skippedRows }
}

function readCell(row: unknown[], index: number): string {
  return index >= 0 ? String(row[index] ?? '').trim() : ''
}

function shouldIgnoreRow(status: string, flow: string): boolean {
  if (flow === '/' || flow.includes('不计收支') || flow.includes('不计入') || flow.includes('不计出')) {
    return true
  }
  return IGNORED_STATUS_KEYWORDS.some((keyword) => status.includes(keyword))
}

function parseBillFlow(flow: string): CategoryFlowType | null {
  if (!flow) return null
  if (flow.includes('收') || flow.includes('入')) return 'INCOME'
  if (flow.includes('支') || flow.includes('出')) return 'EXPENSE'
  return null
}

function resolveAccount(channel: BillChannel, paymentMethod: string) {
  if (paymentMethod.includes('招商') || paymentMethod.includes('银行卡')) {
    return { id: 'account:bank', name: '招商银行卡' }
  }
  return channel === 'WECHAT'
    ? { id: 'account:wechat', name: '微信支付' }
    : { id: 'account:alipay', name: '支付宝' }
}
