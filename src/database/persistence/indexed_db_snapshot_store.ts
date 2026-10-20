import { SQLITE_DATABASE_CONFIG } from '../config/sqlite_config'

interface DatabaseSnapshotRecord {
  key: string
  value: Uint8Array
  updatedAt: number
}

export class IndexedDbSnapshotStore {
  async load(): Promise<Uint8Array | null> {
    const database = await this.open()
    try {
      const transaction = database.transaction(SQLITE_DATABASE_CONFIG.snapshotStoreName, 'readonly')
      const request = transaction.objectStore(SQLITE_DATABASE_CONFIG.snapshotStoreName).get(
        SQLITE_DATABASE_CONFIG.snapshotKey,
      )
      const record = (await requestToPromise(request)) as DatabaseSnapshotRecord | undefined
      return record?.value ?? null
    } finally {
      database.close()
    }
  }

  async save(value: Uint8Array): Promise<void> {
    const database = await this.open()
    try {
      const transaction = database.transaction(SQLITE_DATABASE_CONFIG.snapshotStoreName, 'readwrite')
      const record: DatabaseSnapshotRecord = {
        key: SQLITE_DATABASE_CONFIG.snapshotKey,
        value,
        updatedAt: Date.now(),
      }
      transaction.objectStore(SQLITE_DATABASE_CONFIG.snapshotStoreName).put(record)
      await transactionDone(transaction)
    } finally {
      database.close()
    }
  }

  private open(): Promise<IDBDatabase> {
    const request = indexedDB.open(SQLITE_DATABASE_CONFIG.databaseName, 1)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(SQLITE_DATABASE_CONFIG.snapshotStoreName)) {
        database.createObjectStore(SQLITE_DATABASE_CONFIG.snapshotStoreName, { keyPath: 'key' })
      }
    }
    return requestToPromise(request)
  }
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error ?? new Error('本地数据库访问失败'))
    request.onsuccess = () => resolve(request.result)
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('本地数据库写入失败'))
    transaction.onabort = () => reject(transaction.error ?? new Error('本地数据库写入已中止'))
  })
}
