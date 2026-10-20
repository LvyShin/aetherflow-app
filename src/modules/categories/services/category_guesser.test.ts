import { describe, expect, it } from 'vitest'
import { guessBillCategory } from './category_guesser'

describe('guessBillCategory', () => {
  it('maps common transport and shopping merchants', () => {
    expect(guessBillCategory('中国石化加油站', 'EXPENSE')).toMatchObject({
      categoryName: '交通',
      subcategoryName: '燃油费',
    })
    expect(guessBillCategory('淘宝购物', 'EXPENSE')).toMatchObject({
      categoryName: '购物',
      subcategoryName: '日用百货',
    })
  })

  it('maps salary income', () => {
    expect(guessBillCategory('公司工资奖金', 'INCOME')).toMatchObject({
      categoryName: '薪资',
      subcategoryName: '基本工资',
    })
  })

  it('handles ambiguous merchant names without false positives', () => {
    expect(guessBillCategory('北京月之暗面科技股份有限公司', 'EXPENSE').categoryName).toBe('消费')
    expect(guessBillCategory('贵州高速石化能源有限公司', 'EXPENSE').subcategoryName).toBe('燃油费')
    expect(guessBillCategory('房东-陈长宁', 'EXPENSE').categoryName).toBe('住房')
    expect(guessBillCategory('肯德基', 'EXPENSE').categoryName).toBe('餐饮')
  })
})
