import type { AccountEntity } from '../../accounts/models/account'
import type { CategoryEntity } from '../../categories/models/category'
import type {
  TransactionDraft,
  TransactionImportResult,
  TransactionView,
} from '../models/transaction'

export interface TransactionRepository {
  initialize(): Promise<void>
  listAccounts(): Promise<AccountEntity[]>
  listCategories(): Promise<CategoryEntity[]>
  listTransactions(): Promise<TransactionView[]>
  createTransaction(draft: TransactionDraft): Promise<void>
  importTransactions(drafts: TransactionDraft[], batchId: string): Promise<TransactionImportResult>
  updateTransaction(id: string, draft: TransactionDraft): Promise<void>
  deleteTransaction(id: string): Promise<void>
  deleteTransactions(ids: string[]): Promise<number>
}
