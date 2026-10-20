import { buildCategoryId } from '../constants/default_categories'
import type { CategoryFlowType } from '../models/category'

export interface CategoryGuess {
  categoryId: string
  categoryName: string
  subcategoryName: string
}

export function guessBillCategory(
  text: string,
  flowType: CategoryFlowType,
): CategoryGuess {
  const normalized = text.toLowerCase()
  if (flowType === 'INCOME') return guessIncomeCategory(normalized)

  if (matches(normalized, ['红包'])) return expense('red-packet', 0, '红包', '微信红包')
  if (matches(normalized, ['房租', '房东', '物业', '燃气', '水费', '电费'])) {
    return expense('housing', 0, '住房', '房租物业')
  }
  if (matches(normalized, ['药', '医院', '门诊', '诊所'])) {
    return expense('medical', 0, '医疗', '门诊看病')
  }
  if (
    matches(normalized, [
      '餐厅', '餐饮', '饭店', '饭馆', '食堂', '早餐', '午餐', '晚餐', '烧烤',
      '火锅', '快餐', '米线', '面包', '咖啡', '奶茶', '外卖', '美团', '饿了么',
      '肯德基', 'kfc', '麦当劳', '星巴克', '生鲜', '蔬菜', '水果', '菜市场',
    ])
  ) {
    return expense('food', 0, '餐饮', '早午晚餐')
  }
  if (matches(normalized, ['加油', '石化', '石油', '燃油'])) {
    return expense('transport', 0, '交通', '燃油费')
  }
  if (matches(normalized, ['停车'])) {
    return expense('transport', 1, '交通', '停车费')
  }
  if (matches(normalized, ['高速', 'etc', '过路'])) {
    return expense('transport', 3, '交通', '高速通行')
  }
  if (matches(normalized, ['充电', '途虎', '养车', '车辆维保', '新能源'])) {
    return expense('transport', 4, '交通', '车辆维保')
  }
  if (matches(normalized, ['地铁', '公交', '滴滴', '打车', '出租'])) {
    return expense('transport', 2, '交通', '公共交通')
  }
  if (matches(normalized, ['淘宝', '京东', '拼多多', '超市', '百货', '便利店'])) {
    return expense('shopping', 0, '购物', '日用百货')
  }
  if (matches(normalized, ['话费', '宽带', '流量', '中国移动', '中国联通', '中国电信', '贵州联通'])) {
    return expense('communication', 0, '通讯', '手机话费')
  }
  return {
    categoryId: buildCategoryId('EXPENSE', 'daily'),
    categoryName: '消费',
    subcategoryName: '',
  }
}

function guessIncomeCategory(text: string): CategoryGuess {
  if (matches(text, ['工资', '薪资', '奖金', '补贴'])) {
    return income('salary', 0, '薪资', '基本工资')
  }
  if (matches(text, ['利息', '基金', '分红', '理财'])) {
    return income('finance', 0, '理财', '基金分红')
  }
  if (matches(text, ['红包'])) return income('red-packet-in', 0, '收红包', '微信收红包')
  return income('receipt', 0, '收款', '退款返还')
}

function expense(slug: string, child: number, categoryName: string, subcategoryName: string) {
  return {
    categoryId: buildCategoryId('EXPENSE', slug, String(child)),
    categoryName,
    subcategoryName,
  }
}

function income(slug: string, child: number, categoryName: string, subcategoryName: string) {
  return {
    categoryId: buildCategoryId('INCOME', slug, String(child)),
    categoryName,
    subcategoryName,
  }
}

function matches(source: string, keywords: string[]): boolean {
  return keywords.some((keyword) => source.includes(keyword))
}
