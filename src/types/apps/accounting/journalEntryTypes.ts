import type { AccountType } from './accountTypes'

export type JournalEntryStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'POSTED' | 'REVERSED' | 'VOIDED' | 'ALL'

export interface JournalEntryLineItemType {
  id: string
  journalEntryId: string
  accountId: string
  account?: Pick<AccountType, 'id' | 'code' | 'name' | 'type'>
  description?: string
  debit: number
  credit: number
  currency: string
  exchangeRate: number
  taxId?: string | null
  taxAmount: number
  projectId?: string | null
  departmentId?: string | null
  createdById: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface JournalEntryType {
  id: string
  entryDate: Date | string
  reference: string
  description: string
  status: JournalEntryStatus
  totalDebit: number
  totalCredit: number
  currency: string
  exchangeRate: number
  fiscalYearId: string
  periodId: string
  createdById: string
  approvedById?: string | null
  approvedAt?: Date | string | null
  reversedById?: string | null
  reversedAt?: Date | string | null
  reversedEntryId?: string | null
  notes?: string
  attachments?: string[]
  tags?: string[]
  customFields?: Record<string, unknown>
  createdAt: Date | string
  updatedAt: Date | string
  
  // Relations
  createdBy?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  approvedBy?: {
    id: string
    name: string
    email: string
    avatar?: string
  } | null
  reversedBy?: {
    id: string
    name: string
    email: string
    avatar?: string
  } | null
  reversedEntry?: JournalEntryType | null
  lineItems: JournalEntryLineItemType[]
  fiscalYear?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
  }
  period?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isClosed: boolean
  }
}

export interface JournalEntryFormType {
  id?: string
  entryDate: Date | string
  reference: string
  description: string
  status: JournalEntryStatus
  currency: string
  exchangeRate: number
  fiscalYearId: string
  periodId: string
  notes?: string
  tags?: string[]
  lineItems: Array<{
    accountId: string
    description?: string
    debit: number
    credit: number
    currency: string
    exchangeRate: number
    taxId?: string | null
    projectId?: string | null
    departmentId?: string | null
  }>
}

export interface JournalEntryFilterType {
  search?: string
  status?: JournalEntryStatus
  startDate?: Date | string
  endDate?: Date | string
  fiscalYearId?: string
  periodId?: string
  accountId?: string
  minAmount?: number
  maxAmount?: number
  createdById?: string
  sortBy?: 'entryDate' | 'reference' | 'totalDebit' | 'status' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface JournalEntryBulkActionType {
  ids: string[]
  action: 'post' | 'approve' | 'reverse' | 'void' | 'delete' | 'export'
}

export interface JournalEntrySummaryType {
  totalDebit: number
  totalCredit: number
  balance: number
  count: number
  byStatus: Array<{
    status: JournalEntryStatus
    count: number
    amount: number
  }>
  byAccount: Array<{
    accountId: string
    accountCode: string
    accountName: string
    debit: number
    credit: number
    balance: number
  }>
  byPeriod: Array<{
    periodId: string
    periodName: string
    count: number
    debit: number
    credit: number
  }>
}

export interface JournalEntryImportType {
  entryDate: string
  reference: string
  description: string
  status: JournalEntryStatus
  currency: string
  exchangeRate: number
  fiscalYearId: string
  periodId: string
  lineItems: Array<{
    accountCode: string
    description?: string
    debit: number
    credit: number
    currency?: string
    exchangeRate?: number
    taxCode?: string | null
    projectCode?: string | null
    departmentCode?: string | null
  }>
}

export interface JournalEntryExportType {
  id: string
  entryDate: string
  reference: string
  description: string
  status: JournalEntryStatus
  totalDebit: number
  totalCredit: number
  currency: string
  exchangeRate: number
  fiscalYear: string
  period: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
  lineItems: Array<{
    accountCode: string
    accountName: string
    description?: string
    debit: number
    credit: number
    currency: string
    exchangeRate: number
    taxCode?: string
    taxAmount: number
    projectCode?: string
    departmentCode?: string
  }>
}

export interface JournalEntryReversalType {
  reversalDate: Date | string
  reference: string
  description: string
  notes?: string
}

export interface JournalEntryAttachmentType {
  id: string
  journalEntryId: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  description?: string
  uploadedById: string
  uploadedAt: Date | string
}
