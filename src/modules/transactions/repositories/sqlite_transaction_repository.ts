import { IndexedDbSnapshotStore } from '../../../database/persistence/indexed_db_snapshot_store'
import { SqliteDatabase } from '../../../database/sqlite/sqlite_database'
import { ACCOUNT_SCHEMA_SQL } from '../../accounts/database/schema'
import type { AccountEntity } from '../../accounts/models/account'
import { CATEGORY_SCHEMA_SQL } from '../../categories/database/schema'
import type { CategoryEntity } from '../../categories/models/category'
import { TransactionSeedService } from '../database/seed_service'
import { TRANSACTION_SCHEMA_SQL } from '../database/schema'
import type { TransactionDraft, TransactionView } from '../models/transaction'
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

  async initialize(): Promise<void> {
    if (this.database) return
    const snapshot = await this.snapshotStore.load()
    this.database = await SqliteDatabase.create(snapshot)
    this.database.execute('PRAGMA foreign_keys = ON')
    this.database.execute(ACCOUNT_SCHEMA_SQL)
    this.database.execute(CATEGORY_SCHEMA_SQL)
    this.database.execute(TRANSACTION_SCHEMA_SQL)
    new TransactionSeedService(this.database).seed()
    if (!snapshot) await this.persist()
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
        created_at, updated_at, version, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
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
        now,
        now,
      ],
    )
    await this.persist()
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

  private getDatabase(): SqliteDatabase {
    if (!this.database) throw new Error('SQLite 数据库尚未初始化')
    return this.database
  }

  private async persist(): Promise<void> {
    await this.snapshotStore.save(this.getDatabase().export())
  }
}
