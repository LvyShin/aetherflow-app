import type { CategoryDefinition, CategoryEntity } from '../models/category'

export const EXPENSE_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { slug: 'food', name: '餐饮', icon: '🍔', children: ['早午晚餐', '烟酒茶叶', '水果零食', '咖啡奶茶', '烹饪食材'] },
  { slug: 'shopping', name: '购物', icon: '🛒', children: ['日用百货', '服饰鞋包', '电子数码', '美妆护肤'] },
  { slug: 'transport', name: '交通', icon: '🚗', children: ['燃油费', '停车费', '公共交通', '高速通行', '车辆维保'] },
  { slug: 'daily', name: '消费', icon: '🪙', children: ['美团外卖', '即时零售', '日常休闲'] },
  { slug: 'housing', name: '住房', icon: '🏠', children: ['房租物业', '水电煤气', '家居装修'] },
  { slug: 'communication', name: '通讯', icon: '📱', children: ['手机话费', '宽带网络'] },
  { slug: 'entertainment', name: '娱乐', icon: '🎮', children: ['游戏充值', '电影演出', '运动健身'] },
  { slug: 'medical', name: '医疗', icon: '💊', children: ['门诊看病', '药品保健'] },
  { slug: 'education', name: '教育', icon: '📚', children: ['培训考证', '书籍资料'] },
  { slug: 'red-packet', name: '红包', icon: '🧧', children: ['微信红包', '节日转账'] },
  { slug: 'travel', name: '旅行', icon: '🧳', children: ['机票火车', '酒店住宿', '景区门票'] },
  { slug: 'investment', name: '投资', icon: '📈', children: ['基金理财', '证券股票'] },
  { slug: 'lent', name: '借出', icon: '💸', children: ['朋友借款', '周转备用'] },
  { slug: 'repayment', name: '还款', icon: '💳', children: ['信用卡还款', '花呗白条'] },
  { slug: 'social', name: '人情社交', icon: '💬', children: ['结婚请酒', '人情随礼'] },
  { slug: 'pets', name: '宠物', icon: '🐶', children: ['宠物主粮', '洗护驱虫'] },
  { slug: 'life', name: '生活日用', icon: '📦', children: ['快递邮费', '收纳清洁'] },
  { slug: 'transfer', name: '转账', icon: '🔁', children: ['个人转账', '亲友互转'] },
]

export const INCOME_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { slug: 'transfer-in', name: '收转账', icon: '🔁', children: ['他人转账', '亲友给付'] },
  { slug: 'salary', name: '薪资', icon: '💰', children: ['基本工资', '奖金补贴', '兼职收入'] },
  { slug: 'finance', name: '理财', icon: '📈', children: ['基金分红', '银行利息'] },
  { slug: 'red-packet-in', name: '收红包', icon: '🧧', children: ['微信收红包', '节日礼金'] },
  { slug: 'borrow-in', name: '借入', icon: '🪙', children: ['借款入账', '信用卡套现'] },
  { slug: 'receipt', name: '收款', icon: '💳', children: ['营业款项', '退款返还'] },
]

export const buildCategoryId = (
  flowType: 'EXPENSE' | 'INCOME',
  slug: string,
  child?: string,
) => `category:${flowType.toLowerCase()}:${slug}${child ? `:${child}` : ''}`

function flattenDefinitions(
  flowType: 'EXPENSE' | 'INCOME',
  definitions: CategoryDefinition[],
): CategoryEntity[] {
  return definitions.flatMap((definition, primaryIndex) => {
    const parentId = buildCategoryId(flowType, definition.slug)
    return [
      {
        id: parentId,
        parentId: null,
        name: definition.name,
        flowType,
        icon: definition.icon,
        sortOrder: primaryIndex,
      },
      ...definition.children.map((name, childIndex) => ({
        id: buildCategoryId(flowType, definition.slug, String(childIndex)),
        parentId,
        name,
        flowType,
        icon: definition.icon,
        sortOrder: childIndex,
      })),
    ]
  })
}

export const DEFAULT_CATEGORIES: CategoryEntity[] = [
  ...flattenDefinitions('EXPENSE', EXPENSE_CATEGORY_DEFINITIONS),
  ...flattenDefinitions('INCOME', INCOME_CATEGORY_DEFINITIONS),
]
