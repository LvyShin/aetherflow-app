import { IndexedDbSnapshotStore } from '../../../database/persistence/indexed_db_snapshot_store'
import { SqliteDatabase } from '../../../database/sqlite/sqlite_database'
import { ACCOUNT_SCHEMA_SQL } from '../../accounts/database/schema'
import type { AccountEntity } from '../../accounts/models/account'
import { CATEGORY_SCHEMA_SQL } from '../../categories/database/schema'
import type { CategoryEntity } from '../../categories/models/category'
import { guessBillCategory } from '../../categories/services/category_guesser'
import { TransactionSeedService } from '../database/seed_service'
import {
  TRANSACTION_IMPORT_SCHEMA_SQL,
  TRANSACTION_SCHEMA_SQL,
} from '../database/schema'
import type {
  TransactionDraft,
  TransactionImportResult,
  TransactionView,
} from '../models/transaction'
import { normalizeTransactionDraft } from '../services/transaction_validator'
import type { TransactionRepository } from './transaction_repository'
import { mapTransactionRow, type TransactionRow } from './transaction_row_mapper'

const TRANSACTION_SELECT_SQL = `
  SELECT
    t.id,
    t.account_id,
    t.category_id,
    t.amount,
    t.flow_type,
    t.transacted_at,
    t.merchant,
    t.remark,
    t.source_tag,
    t.is_vehicle_expense,
    t.vehicle_id,
    t.external_id,
    t.import_batch_id,
    t.created_at,
    t.updated_at,
    t.version,
    a.name AS account_name,
    COALESCE(p.name, c.name) AS category_name,
    c.icon AS category_icon,
    COALESCE(p.id, c.id) AS primary_category_id,
    COALESCE(p.name, c.name) AS primary_category_name,
    CASE WHEN c.parent_id IS NOT NULL THEN c.name ELSE '' END AS subcategory_name
  FROM transactions t
  JOIN accounts a ON a.id = t.account_id
  JOIN categories c ON c.id = t.category_id
  LEFT JOIN categories p ON p.id = c.parent_id
`

export class SqliteTransactionRepository implements TransactionRepository {
  private database: SqliteDatabase | null = null
  private readonly snapshotStore = new IndexedDbSnapshotStore()

  constructor(private readonly locateWasm?: () => string) {}

  async initialize(): Promise<void> {
    if (this.database) return
    const snapshot = await this.snapshotStore.load()
    this.database = await SqliteDatabase.create(snapshot, this.locateWasm)
    this.database.execute('PRAGMA foreign_keys = ON')
    this.database.execute(ACCOUNT_SCHEMA_SQL)
    this.database.execute(CATEGORY_SCHEMA_SQL)
    this.database.execute(TRANSACTION_SCHEMA_SQL)
    this.ensureImportColumns()
    this.database.execute(TRANSACTION_IMPORT_SCHEMA_SQL)
    new TransactionSeedService(this.database).seed()
    const cleanedLegacyDemo = this.cleanupLegacyDemoTransactions()
    const reclassifiedImports = this.reclassifyImportedTransactions()
    if (!snapshot || cleanedLegacyDemo || reclassifiedImports) await this.persist()
  }

  async listAccounts(): Promise<AccountEntity[]> {
    const rows = this.getDatabase().query<{
      id: string
      name: string
      type: AccountEntity['type']
      sort_order: number
    }>(
      `SELECT id, name, type, sort_order
       FROM accounts
       WHERE is_deleted = 0
       ORDER BY sort_order, name`,
    )
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      sortOrder: row.sort_order,
    }))
  }

  async listCategories(): Promise<CategoryEntity[]> {
    const rows = this.getDatabase().query<{
      id: string
      parent_id: string | null
      name: string
      flow_type: 'EXPENSE' | 'INCOME'
      icon: string
      sort_order: number
    }>(
      `SELECT id, parent_id, name, flow_type, icon, sort_order
       FROM categories
       WHERE is_deleted = 0
       ORDER BY flow_type, parent_id IS NOT NULL, sort_order, name`,
    )
    return rows.map((row) => ({
      id: row.id,
      parentId: row.parent_id,
      name: row.name,
      flowType: row.flow_type,
      icon: row.icon,
      sortOrder: row.sort_order,
    }))
  }

  async listTransactions(): Promise<TransactionView[]> {
    const rows = this.getDatabase().query<TransactionRow>(`
      ${TRANSACTION_SELECT_SQL}
      WHERE t.is_deleted = 0
      ORDER BY t.transacted_at DESC, t.created_at DESC
    `)
    return rows.map(mapTransactionRow)
  }

  async createTransaction(draft: TransactionDraft): Promise<void> {
    const transaction = normalizeTransactionDraft(draft)
    const now = Date.now()
    this.getDatabase().run(
      `INSERT INTO transactions (
        id, account_id, category_id, amount, flow_type, transacted_at,
        merchant, remark, source_tag, is_vehicle_expense, vehicle_id,
        external_id, import_batch_id, created_at, updated_at, version, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
      [
        crypto.randomUUID(),
        transaction.accountId,
        transaction.categoryId,
        transaction.amount,
        transaction.flowType,
        transaction.transactedAt,
        transaction.merchant,
        transaction.remark,
        transaction.sourceTag,
        transaction.isVehicleExpense ? 1 : 0,
        transaction.vehicleId ?? null,
        transaction.externalId ?? null,
        transaction.importBatchId ?? null,
        now,
        now,
      ],
    )
    await this.persist()
  }

  async importTransactions(
    drafts: TransactionDraft[],
    batchId: string,
  ): Promise<TransactionImportResult> {
    if (drafts.length === 0) return { inserted: 0, duplicates: 0, batchId }
    const normalized = drafts.map(normalizeTransactionDraft)
    const externalIds = normalized
      .map((transaction) => transaction.externalId)
      .filter((externalId): externalId is string => Boolean(externalId))
    const existing = this.findExistingExternalIds(externalIds)
    const seen = new Set<string>()
    let inserted = 0

    this.getDatabase().transaction(() => {
      for (const transaction of normalized) {
        const externalId = transaction.externalId ?? null
        if (externalId && (existing.has(externalId) || seen.has(externalId))) continue
        if (externalId) seen.add(externalId)
        const now = Date.now()
        this.getDatabase().run(
          `INSERT INTO transactions (
            id, account_id, category_id, amount, flow_type, transacted_at,
            merchant, remark, source_tag, is_vehicle_expense, vehicle_id,
            external_id, import_batch_id, created_at, updated_at, version, is_deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
          [
            crypto.randomUUID(),
            transaction.accountId,
            transaction.categoryId,
            transaction.amount,
            transaction.flowType,
            transaction.transactedAt,
            transaction.merchant,
            transaction.remark,
            transaction.sourceTag,
            transaction.isVehicleExpense ? 1 : 0,
            transaction.vehicleId ?? null,
            externalId,
            transaction.importBatchId ?? batchId,
            now,
            now,
          ],
        )
        inserted += 1
      }
    })
    await this.persist()
    return { inserted, duplicates: normalized.length - inserted, batchId }
  }

  async updateTransaction(id: string, draft: TransactionDraft): Promise<void> {
    const transaction = normalizeTransactionDraft(draft)
    this.getDatabase().run(
      `UPDATE transactions
       SET account_id = ?, category_id = ?, amount = ?, flow_type = ?,
           transacted_at = ?, merchant = ?, remark = ?, source_tag = ?,
           is_vehicle_expense = ?, vehicle_id = ?, updated_at = ?, version = version + 1
       WHERE id = ? AND is_deleted = 0`,
      [
        transaction.accountId,
        transaction.categoryId,
        transaction.amount,
        transaction.flowType,
        transaction.transactedAt,
        transaction.merchant,
        transaction.remark,
        transaction.sourceTag,
        transaction.isVehicleExpense ? 1 : 0,
        transaction.vehicleId ?? null,
        Date.now(),
        id,
      ],
    )
    await this.persist()
  }

  async deleteTransaction(id: string): Promise<void> {
    this.getDatabase().run(
      `UPDATE transactions
       SET is_deleted = 1, updated_at = ?, version = version + 1
       WHERE id = ? AND is_deleted = 0`,
      [Date.now(), id],
    )
    await this.persist()
  }

  async deleteTransactions(ids: string[]): Promise<number> {
    const uniqueIds = [...new Set(ids)].filter(Boolean)
    if (uniqueIds.length === 0) return 0
    const placeholders = uniqueIds.map(() => '?').join(', ')
    const before = this.getDatabase().scalar<number>(
      `SELECT COUNT(*) AS value FROM transactions
       WHERE is_deleted = 0 AND id IN (${placeholders})`,
      uniqueIds,
    ) ?? 0
    this.getDatabase().run(
      `UPDATE transactions
       SET is_deleted = 1, updated_at = ?, version = version + 1
       WHERE is_deleted = 0 AND id IN (${placeholders})`,
      [Date.now(), ...uniqueIds],
    )
    await this.persist()
    return before
  }

  private getDatabase(): SqliteDatabase {
    if (!this.database) throw new Error('SQLite 数据库尚未初始化')
    return this.database
  }

  private ensureImportColumns(): void {
    const columns = this.getDatabase().query<{ name: string }>('PRAGMA table_info(transactions)')
    const names = new Set(columns.map((column) => column.name))
    if (!names.has('external_id')) {
      this.getDatabase().execute('ALTER TABLE transactions ADD COLUMN external_id TEXT')
    }
    if (!names.has('import_batch_id')) {
      this.getDatabase().execute('ALTER TABLE transactions ADD COLUMN import_batch_id TEXT')
    }
  }

  private cleanupLegacyDemoTransactions(): boolean {
    const completed = this.getDatabase().scalar<number>(
      `SELECT COUNT(*) AS value FROM user_settings
       WHERE setting_key = 'legacy_demo_cleanup_v1'`,
    )
    if (completed) return false
    this.getDatabase().run(
      `UPDATE transactions
       SET is_deleted = 1, updated_at = ?, version = version + 1
       WHERE is_deleted = 0 AND id LIKE 'seed-%'`,
      [Date.now()],
    )
    this.getDatabase().run(
      `INSERT INTO user_settings (setting_key, setting_value, updated_at)
       VALUES ('legacy_demo_cleanup_v1', 'true', ?)`,
      [Date.now()],
    )
    return true
  }

  private reclassifyImportedTransactions(): boolean {
    const completed = this.getDatabase().scalar<number>(
      `SELECT COUNT(*) AS value FROM user_settings
       WHERE setting_key = 'import_category_rules_v2'`,
    )
    if (completed) return false
    const rows = this.getDatabase().query<{
      id: string
      merchant: string | null
      flow_type: 'EXPENSE' | 'INCOME'
    }>(
      `SELECT id, merchant, flow_type
       FROM transactions
       WHERE is_deleted = 0
         AND version = 1
         AND source_tag IN ('微信账单导入', '支付宝账单导入')`,
    )
    const now = Date.now()
    for (const row of rows) {
      const category = guessBillCategory(row.merchant ?? '', row.flow_type)
      this.getDatabase().run(
        `UPDATE transactions
         SET category_id = ?, updated_at = ?, version = version + 1
         WHERE id = ?`,
        [category.categoryId, now, row.id],
      )
    }
    this.getDatabase().run(
      `INSERT INTO user_settings (setting_key, setting_value, updated_at)
       VALUES ('import_category_rules_v2', 'true', ?)`,
      [now],
    )
    return true
  }

  private findExistingExternalIds(externalIds: string[]): Set<string> {
    if (externalIds.length === 0) return new Set()
    const uniqueIds = [...new Set(externalIds)]
    const placeholders = uniqueIds.map(() => '?').join(', ')
    const rows = this.getDatabase().query<{ external_id: string }>(
      `SELECT external_id
       FROM transactions
       WHERE is_deleted = 0 AND external_id IN (${placeholders})`,
      uniqueIds,
    )
    return new Set(rows.map((row) => row.external_id))
  }

  private async persist(): Promise<void> {
    await this.snapshotStore.save(this.getDatabase().export())
  }
}
