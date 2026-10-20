import { describe, expect, it } from 'vitest'
import { appendAmountKey } from './amount_input'

describe('appendAmountKey', () => {
  it('builds a decimal amount from sequential key presses', () => {
    let value = '0'
    for (const key of ['1', '2', '.', '5', '0']) value = appendAmountKey(value, key)
    expect(value).toBe('12.50')
  })

  it('limits decimals and supports delete and clear operations', () => {
    expect(appendAmountKey('12.50', '1')).toBe('12.50')
    expect(appendAmountKey('12.50', 'del')).toBe('12.5')
    expect(appendAmountKey('12.5', 'clear')).toBe('0')
  })
})
