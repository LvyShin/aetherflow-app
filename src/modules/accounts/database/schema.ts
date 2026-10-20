export const ACCOUNT_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance REAL DEFAULT 0.00,
    currency TEXT DEFAULT 'CNY',
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    version INTEGER DEFAULT 1,
    is_deleted INTEGER DEFAULT 0
  );
`
