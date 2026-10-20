import { IMPORT_FILE_LIMIT_BYTES } from '../constants/header_keywords'
import type { BillImportPreview } from '../models/bill_import'
import { detectBillHeader } from './header_detector'
import { mapBillRows } from './bill_row_mapper'
import { getBillFileType, readBillMatrix } from './file_reader'

export class BillImportParser {
  async parse(file: File): Promise<BillImportPreview> {
    const fileType = getBillFileType(file.name)
    if (!fileType) throw new Error('仅支持 .xlsx、.xls 或 .csv 账单文件')
    if (file.size > IMPORT_FILE_LIMIT_BYTES) throw new Error('单次导入文件不能超过 1MB')

    const matrix = await readBillMatrix(file)
    const detection = detectBillHeader(matrix, file.name)
    if (!detection) {
      throw new Error('未识别到微信或支付宝账单表头，请确认文件来自官方账单导出')
    }
    const mapped = await mapBillRows(matrix, detection)
    if (mapped.rows.length === 0) {
      throw new Error(mapped.issues[0]?.message ?? '账单中没有可导入的有效流水')
    }
    const timestamps = mapped.rows.map((row) => row.transactedAt)
    return {
      fileName: file.name,
      fileType,
      fileSize: file.size,
      channel: detection.channel,
      rows: mapped.rows,
      issues: mapped.issues,
      skippedRows: mapped.skippedRows,
      totalExpense: sum(mapped.rows.filter((row) => row.flowType === 'EXPENSE')),
      totalIncome: sum(mapped.rows.filter((row) => row.flowType === 'INCOME')),
      earliestAt: Math.min(...timestamps),
      latestAt: Math.max(...timestamps),
    }
  }
}

function sum(rows: BillImportPreview['rows']): number {
  return Math.round(rows.reduce((total, row) => total + row.amount, 0) * 100) / 100
}
