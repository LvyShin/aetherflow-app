export const TRANSACTION_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    amount REAL NOT NULL,
    flow_type TEXT NOT NULL,
    transacted_at INTEGER NOT NULL,
    merchant TEXT,
    remark TEXT,
    source_tag TEXT,
    is_vehicle_expense INTEGER DEFAULT 0,
    vehicle_id TEXT,
    external_id TEXT,
    import_batch_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    version INTEGER DEFAULT 1,
    is_deleted INTEGER DEFAULT 0,
    FOREIGN KEY(account_id) REFERENCES accounts(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_time
    ON transactions(is_deleted, transacted_at DESC);
  CREATE INDEX IF NOT EXISTS idx_transactions_account
    ON transactions(is_deleted, account_id, transacted_at DESC);

  CREATE TABLE IF NOT EXISTS user_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`

export const TRANSACTION_IMPORT_SCHEMA_SQL = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_external_id
    ON transactions(external_id)
    WHERE external_id IS NOT NULL AND is_deleted = 0;
`
