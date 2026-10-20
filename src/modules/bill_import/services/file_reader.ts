import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { BillFileType } from '../models/bill_import'

export function getBillFileType(fileName: string): BillFileType | null {
  const extension = fileName.toLowerCase().split('.').pop()
  if (extension === 'xlsx') return 'XLSX'
  if (extension === 'xls') return 'XLS'
  if (extension === 'csv') return 'CSV'
  return null
}

export async function readBillMatrix(file: File): Promise<unknown[][]> {
  const type = getBillFileType(file.name)
  if (!type) throw new Error('仅支持 .xlsx、.xls 或 .csv 账单文件')
  if (type === 'CSV') return readCsvMatrix(file)
  return readSpreadsheetMatrix(file)
}

async function readSpreadsheetMatrix(file: File): Promise<unknown[][]> {
  const workbook = XLSX.read(await file.arrayBuffer(), {
    type: 'array',
    cellDates: true,
    dense: false,
  })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) throw new Error('工作簿中没有可读取的工作表')
  const sheet = workbook.Sheets[firstSheetName]
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: '',
    blankrows: true,
    raw: true,
  })
}

async function readCsvMatrix(file: File): Promise<unknown[][]> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const text = decodeCsv(bytes)
  const result = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: false,
    dynamicTyping: false,
  })
  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(`CSV 解析失败：${result.errors[0]?.message ?? '未知错误'}`)
  }
  return result.data
}

function decodeCsv(bytes: Uint8Array): string {
  const utf8 = new TextDecoder('utf-8').decode(bytes)
  if (!utf8.includes('\uFFFD')) return utf8
  try {
    return new TextDecoder('gb18030').decode(bytes)
  } catch {
    return utf8
  }
}
