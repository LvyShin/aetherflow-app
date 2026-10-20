import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { BillImportParser } from './bill_import_parser'

describe('BillImportParser', () => {
  it('parses a complete WeChat CSV file', async () => {
    const csv = [
      '微信支付账单明细',
      '导出时间,2026-10-20 10:00:00',
      '',
      '交易时间,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号',
      '2026-10-20 09:00:00,巷口早餐店,豆浆油条,支出,8.00,零钱,支付成功,wx-file-001',
      '2026-10-20 10:00:00,测试公司,十月工资,收入,"4,000.00",招商银行卡,已到账,wx-file-002',
      '2026-10-19 12:00:00,退款商户,交易退款,收入,18.80,零钱,已退款,wx-file-003',
    ].join('\n')
    const parser = new BillImportParser()

    const preview = await parser.parse(fileLike('微信账单.csv', csv))

    expect(preview.channel).toBe('WECHAT')
    expect(preview.rows).toHaveLength(2)
    expect(preview.totalExpense).toBe(8)
    expect(preview.totalIncome).toBe(4000)
    expect(preview.issues).toHaveLength(0)
  })

  it('parses a complete Alipay XLSX workbook', async () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ['支付宝交易明细'],
      ['交易时间', '交易对方', '商品说明', '收/支', '金额', '交易状态', '交易订单号'],
      ['2026-10-01 12:00:00', '淘宝购物', '日用百货', '支出', '14.52', '支付成功', 'ali-file-001'],
    ])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, sheet, '账单')
    const bytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })

    const preview = await new BillImportParser().parse(fileLike('支付宝账单.xlsx', bytes))

    expect(preview.channel).toBe('ALIPAY')
    expect(preview.rows[0]).toMatchObject({
      merchant: '淘宝购物',
      amount: 14.52,
      categoryName: '购物',
      accountId: 'account:alipay',
    })
  })
})

function fileLike(name: string, content: Uint8Array | ArrayBuffer | string): File {
  const bytes =
    typeof content === 'string'
      ? new TextEncoder().encode(content)
      : content instanceof Uint8Array
        ? content
        : new Uint8Array(content)
  return {
    name,
    size: bytes.byteLength,
    arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  } as File
}
