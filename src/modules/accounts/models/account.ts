export type AccountType = 'WECHAT' | 'ALIPAY' | 'BANK_CARD' | 'CASH'

export interface AccountEntity {
  id: string
  name: string
  type: AccountType
  sortOrder: number
}
