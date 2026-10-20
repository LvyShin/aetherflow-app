export function appendAmountKey(currentValue: string, key: string): string {
  if (key === 'clear') return '0'
  if (key === 'del') return currentValue.length > 1 ? currentValue.slice(0, -1) : '0'
  if (key === '.' && currentValue.includes('.')) return currentValue
  if (currentValue === '0' && key !== '.') return key
  if (currentValue.includes('.') && currentValue.split('.')[1]?.length >= 2) return currentValue
  return `${currentValue}${key}`
}
