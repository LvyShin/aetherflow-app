export const HEADER_ALIASES = {
  time: ['交易时间', '创建时间', '付款时间', '交易日期'],
  type: ['交易类型', '类型'],
  peer: ['交易对方', '对方', '商户名称'],
  goods: ['商品', '商品名称', '商品说明', '交易说明'],
  flow: ['收/支', '收支', '资金流向'],
  amount: ['金额(元)', '金额（元）', '金额', '交易金额'],
  method: ['支付方式', '付款方式'],
  status: ['当前状态', '交易状态', '状态'],
  transactionId: ['交易单号', '交易订单号', '商户单号', '订单号'],
} as const

export const IMPORT_FILE_LIMIT_BYTES = 1024 * 1024
export const IMPORT_HEADER_SCAN_LIMIT = 50
