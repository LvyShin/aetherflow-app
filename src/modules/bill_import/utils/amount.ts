export function parseBillAmount(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null
  const text = String(value ?? '')
    .replace(/[¥￥,\s]/g, '')
    .trim()
  if (!text || text === '/') return null
  const amount = Number.parseFloat(text)
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) / 100 : null
}
