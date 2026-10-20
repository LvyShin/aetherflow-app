export async function createBillFingerprint(parts: Array<string | number>): Promise<string> {
  const payload = new TextEncoder().encode(parts.join('|'))
  const digest = await crypto.subtle.digest('SHA-256', payload)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}
