import 'fake-indexeddb/auto'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import type { TransactionDraft } from '../models/transaction'
import { SqliteTransactionRepository } from './sqlite_transaction_repository'

describe('SqliteTransactionRepository import', () => {
  it('stores imported rows once and skips duplicate fingerprints', async () => {
    const require = createRequire(import.meta.url)
    const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm')
    const repository = new SqliteTransactionRepository(() => wasmPath)
    await repository.initialize()
    expect(await repository.listTransactions()).toHaveLength(0)
    const draft: TransactionDraft = {
      accountId: 'account:wechat',
      categoryId: 'category:expense:food:0',
      amount: 8,
      flowType: 'EXPENSE',
      transactedAt: new Date(2026, 9, 20, 9, 0).getTime(),
      merchant: '巷口早餐店',
      remark: '原交易单号：wx-repository-001',
      sourceTag: '微信账单导入',
      externalId: 'fingerprint-repository-001',
      importBatchId: 'batch-001',
    }

    const first = await repository.importTransactions([draft], 'batch-001')
    const second = await repository.importTransactions([draft], 'batch-002')
    const imported = (await repository.listTransactions()).filter(
      (transaction) => transaction.externalId === draft.externalId,
    )

    expect(first).toMatchObject({ inserted: 1, duplicates: 0, batchId: 'batch-001' })
    expect(second).toMatchObject({ inserted: 0, duplicates: 1, batchId: 'batch-002' })
    expect(imported).toHaveLength(1)
    expect(imported[0]?.importBatchId).toBe('batch-001')

    const deleted = await repository.deleteTransactions([imported[0]!.id])
    expect(deleted).toBe(1)
    expect(
      (await repository.listTransactions()).filter(
        (transaction) => transaction.externalId === draft.externalId,
      ),
    ).toHaveLength(0)
  })
})
