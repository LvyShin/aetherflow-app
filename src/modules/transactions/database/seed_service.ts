import { DEFAULT_ACCOUNTS } from '../../accounts/constants/default_accounts'
import { DEFAULT_CATEGORIES } from '../../categories/constants/default_categories'
import type { SqliteDatabase } from '../../../database/sqlite/sqlite_database'

export class TransactionSeedService {
  constructor(private readonly database: SqliteDatabase) {}

  seed(referenceTime = Date.now()): void {
    this.database.transaction(() => {
      this.insertAccounts(referenceTime)
      this.insertCategories(referenceTime)
      this.markReferenceDataSeeded(referenceTime)
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

  private markReferenceDataSeeded(referenceTime: number): void {
    this.database.run(
      `INSERT OR REPLACE INTO user_settings (setting_key, setting_value, updated_at)
       VALUES ('reference_data_v1', 'true', ?)`,
      [referenceTime],
    )
  }
}
