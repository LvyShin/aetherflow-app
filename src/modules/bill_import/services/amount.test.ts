import { describe, expect, it } from 'vitest'
import { parseBillAmount } from '../utils/amount'
import { parseBillTimestamp } from '../utils/datetime'

describe('bill value parsers', () => {
  it('parses signed display characters and grouped amounts', () => {
    expect(parseBillAmount('¥1,234.56')).toBe(1234.56)
    expect(parseBillAmount('/')).toBeNull()
  })

  it('parses common official bill time formats', () => {
    expect(parseBillTimestamp('2026-10-19 18:34:00')).not.toBeNull()
    expect(parseBillTimestamp('2026/10/19 18:34')).not.toBeNull()
    expect(parseBillTimestamp('无效时间')).toBeNull()
  })
})
