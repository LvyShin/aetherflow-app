export const CATEGORY_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    parent_id TEXT,
    name TEXT NOT NULL,
    flow_type TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    version INTEGER DEFAULT 1,
    is_deleted INTEGER DEFAULT 0,
    FOREIGN KEY(parent_id) REFERENCES categories(id)
  );
`
