import initSqlJs, { type Database, type SqlValue } from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

export class SqliteDatabase {
  private constructor(private readonly database: Database) {}

  static async create(
    snapshot: Uint8Array | null,
    locateWasm: () => string = () => sqlWasmUrl,
  ): Promise<SqliteDatabase> {
    const SQL = await initSqlJs({ locateFile: locateWasm })
    return new SqliteDatabase(new SQL.Database(snapshot ?? undefined))
  }

  execute(sql: string): void {
    this.database.run(sql)
  }

  query<T>(sql: string, parameters: SqlValue[] = []): T[] {
    const statement = this.database.prepare(sql)
    const rows: T[] = []
    try {
      statement.bind(parameters)
      while (statement.step()) rows.push(statement.getAsObject() as T)
      return rows
    } finally {
      statement.free()
    }
  }

  scalar<T>(sql: string, parameters: SqlValue[] = []): T | undefined {
    return this.query<{ value: T }>(sql, parameters)[0]?.value
  }

  run(sql: string, parameters: SqlValue[] = []): void {
    this.database.run(sql, parameters)
  }

  transaction(action: () => void): void {
    this.database.run('BEGIN TRANSACTION')
    try {
      action()
      this.database.run('COMMIT')
    } catch (error) {
      this.database.run('ROLLBACK')
      throw error
    }
  }

  export(): Uint8Array {
    return this.database.export()
  }
}
