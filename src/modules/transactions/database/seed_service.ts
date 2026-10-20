import { DEFAULT_ACCOUNTS } from '../../accounts/constants/default_accounts'
import { DEFAULT_CATEGORIES } from '../../categories/constants/default_categories'
import type { SqliteDatabase } from '../../../database/sqlite/sqlite_database'
import { createDemoTransactions } from './demo_transactions'

export class TransactionSeedService {
  constructor(private readonly database: SqliteDatabase) {}

  seed(referenceTime = Date.now()): void {
    this.database.transaction(() => {
      this.insertAccounts(referenceTime)
      this.insertCategories(referenceTime)
      this.insertDemoTransactions(referenceTime)
    })
  }

  private insertAccounts(referenceTime: number): void {
    for (const account of DEFAULT_ACCOUNTS) {
      this.database.run(
        `INSERT OR IGNORE INTO accounts (
          id, name, type, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [account.id, account.name, account.type, account.sortOrder, referenceTime, referenceTime],
      )
    }
  }

  private insertCategories(referenceTime: number): void {
    for (const category of DEFAULT_CATEGORIES) {
      this.database.run(
        `INSERT OR IGNORE INTO categories (
          id, parent_id, name, flow_type, icon, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          category.parentId,
          category.name,
          category.flowType,
          category.icon,
          category.sortOrder,
          referenceTime,
          referenceTime,
        ],
      )
    }
  }

  private insertDemoTransactions(referenceTime: number): void {
    const seeded = this.database.scalar<number>(
      `SELECT COUNT(*) AS value FROM user_settings WHERE setting_key = 'initial_seed_v1'`,
    )
    if (seeded) return

    for (const transaction of createDemoTransactions()) {
      this.database.run(
        `INSERT INTO transactions (
          id, account_id, category_id, amount, flow_type, transacted_at,
          merchant, remark, source_tag, is_vehicle_expense, vehicle_id,
          created_at, updated_at, version, is_deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
        [
          transaction.id,
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
          referenceTime,
          referenceTime,
        ],
      )
    }
    this.database.run(
      `INSERT INTO user_settings (setting_key, setting_value, updated_at)
       VALUES ('initial_seed_v1', 'true', ?)`,
      [referenceTime],
    )
  }
}
