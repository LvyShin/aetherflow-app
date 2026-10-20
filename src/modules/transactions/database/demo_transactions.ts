import { buildCategoryId } from '../../categories/constants/default_categories'
import type { TransactionDraft } from '../models/transaction'

interface SeedTransaction extends TransactionDraft {
  id: string
}

export function createDemoTransactions(referenceDate = new Date()): SeedTransaction[] {
  const daysInMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0,
  ).getDate()
  const at = (day: number, hour: number, minute: number) =>
    new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      Math.min(day, daysInMonth),
      hour,
      minute,
    ).getTime()

  return [
    demo('seed-food-breakfast', 'WECHAT', 6, at(19, 8, 53), '观山湖区米食家餐饮店', ['EXPENSE', 'food', '0']),
    demo('seed-food-lunch', 'ALIPAY', 2, at(19, 18, 34), '付款给好鲜生生鲜蔬菜(**相)', ['EXPENSE', 'food', '0']),
    demo('seed-shopping', 'ALIPAY', 14.52, at(19, 14, 50), '淘宝购物', ['EXPENSE', 'shopping', '0']),
    demo('seed-travel', 'ALIPAY', 85, at(19, 14, 30), '广州维谦网络科技有限公司', ['EXPENSE', 'travel', '0']),
    demo('seed-takeout', 'WECHAT', 47.2, at(19, 11, 5), '美团', ['EXPENSE', 'daily', '0']),
    demo('seed-salary', 'BANK_CARD', 4922.43, at(18, 12, 0), '工资入账', ['INCOME', 'salary', '0']),
    demo('seed-fuel', 'WECHAT', 1063, at(15, 9, 20), '中国石化加油站', ['EXPENSE', 'transport', '0'], true),
    demo('seed-social', 'WECHAT', 1000, at(12, 18, 30), '微信转账随礼', ['EXPENSE', 'social', '1']),
    demo('seed-groceries', 'ALIPAY', 661.86, at(10, 14, 0), '百货超市生活用品', ['EXPENSE', 'shopping', '0']),
    demo('seed-dinner', 'WECHAT', 738.33, at(5, 19, 10), '聚餐宴请', ['EXPENSE', 'food', '0']),
  ]
}

function demo(
  id: string,
  account: 'WECHAT' | 'ALIPAY' | 'BANK_CARD',
  amount: number,
  transactedAt: number,
  merchant: string,
  category: ['EXPENSE' | 'INCOME', string, string],
  isVehicleExpense = false,
): SeedTransaction {
  const accountIdMap = {
    WECHAT: 'account:wechat',
    ALIPAY: 'account:alipay',
    BANK_CARD: 'account:bank',
  }
  const sourceTagMap = {
    WECHAT: '微信自动记账',
    ALIPAY: '支付宝自动记账',
    BANK_CARD: '招商银行卡',
  }

  return {
    id,
    accountId: accountIdMap[account],
    categoryId: buildCategoryId(category[0], category[1], category[2]),
    amount,
    flowType: category[0],
    transactedAt,
    merchant,
    remark: '',
    sourceTag: id === 'seed-salary' ? '工资打卡' : sourceTagMap[account],
    isVehicleExpense,
    vehicleId: null,
  }
}
