import type { AccountType } from './accountTypes'

export type TransactionStatus = 'DRAFT' | 'PENDING' | 'POSTED' | 'VOIDED' | 'RECONCILED' | 'ALL'
export type TransactionType = 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'PAYMENT' | 'RECEIPT' | 'JOURNAL' | 'ALL'

export interface BaseTransaction {
  id: string
  transactionDate: Date | string
  reference: string
  description?: string
  amount: number
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER'
  status: TransactionStatus
  accountId: string
  relatedAccountId: string
  createdById: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Transaction extends BaseTransaction {
  account?: AccountType
  relatedAccount?: AccountType
  createdBy?: {
    id: string
    name: string
    email: string
  }
}

export interface TransactionFormData {
  id?: string
  transactionDate: Date | string
  reference: string
  description?: string
  amount: number
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER'
  status: TransactionStatus
  accountId: string
  relatedAccountId: string
  createdById: string
}

export interface TransactionFilterType {
  search?: string
  status?: TransactionStatus
  type?: 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'ALL'
  accountId?: string
  startDate?: Date | string
  endDate?: Date | string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TransactionBulkActionType {
  ids: string[]
  action: 'post' | 'void' | 'delete' | 'export'
}

export interface TransactionImportType {
  transactionDate: string
  reference: string
  description?: string
  amount: number
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER'
  status: TransactionStatus
  accountCode: string
  relatedAccountCode: string
}

export interface TransactionExportType {
  id: string
  transactionDate: string
  reference: string
  description?: string
  amount: number
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER'
  status: TransactionStatus
  accountCode: string
  accountName: string
  relatedAccountCode: string
  relatedAccountName: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TransactionSummaryType {
  totalDebit: number
  totalCredit: number
  balance: number
  count: number
}

export interface TransactionAccountSummaryType {
  accountId: string
  accountCode: string
  accountName: string
  totalDebit: number
  totalCredit: number
  balance: number
  transactionCount: number
}

export interface TransactionReconciliationType {
  id: string
  transactionId: string
  reconciliationDate: Date | string
  reconciledById: string
  notes?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TransactionAttachmentType {
  id: string
  transactionId: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  description?: string
  uploadedById: string
  uploadedAt: Date | string
}

export interface TransactionCategoryType {
  id: string
  name: string
  description?: string
  isActive: boolean
  parentId?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TransactionTemplateType {
  id: string
  name: string
  description?: string
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER'
  accountId: string
  relatedAccountId: string
  amount?: number
  isActive: boolean
  createdById: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TransactionRecurringType {
  id: string
  name: string
  description?: string
  startDate: Date | string
  endDate?: Date | string
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  interval: number
  transactionTemplateId: string
  lastProcessed?: Date | string
  nextProcessDate: Date | string
  isActive: boolean
  createdById: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface TransactionSplitType {
  id: string
  transactionId: string
  accountId: string
  amount: number
  description?: string
  reference?: string
  createdById: string
  createdAt: Date | string
  updatedAt: Date | string
}
