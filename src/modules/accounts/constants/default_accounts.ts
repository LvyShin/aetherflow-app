import type { AccountEntity } from '../models/account'

export const DEFAULT_ACCOUNTS: AccountEntity[] = [
  { id: 'account:wechat', name: '微信支付', type: 'WECHAT', sortOrder: 0 },
  { id: 'account:alipay', name: '支付宝', type: 'ALIPAY', sortOrder: 1 },
  { id: 'account:bank', name: '招商银行卡', type: 'BANK_CARD', sortOrder: 2 },
  { id: 'account:cash', name: '现金', type: 'CASH', sortOrder: 3 },
]
