// Chart of Accounts Types
export interface ChartOfAccount {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  category: string
  description?: string
  balance: number
  isActive: boolean
  level: number
  parentId?: string
  parentCode?: string
  parentName?: string
  createdAt: string
  updatedAt: string
}

export type ChartOfAccountFormData = {
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  category: string
  parentId?: string | null
  description?: string
  isActive?: boolean
}

// Journal Entry Types
export interface JournalEntry {
  id: string
  entryNumber: string
  date: string
  reference?: string
  memo?: string
  totalDebit: number
  totalCredit: number
  status: 'draft' | 'posted' | 'void'
  postedAt?: string
  postedBy?: string
  createdAt: string
  updatedAt: string
  entries: JournalEntryLine[]
}

export interface JournalEntryLine {
  id: string
  accountId: string
  accountCode: string
  accountName: string
  description?: string
  debit: number
  credit: number
}

export type JournalEntryFormData = {
  date: string
  reference?: string
  memo?: string
  entries: Array<{
    accountId: string
    description?: string
    debit: number
    credit: number
  }>
}

// General Ledger Types
export interface GeneralLedgerEntry {
  id: string
  date: string
  accountId: string
  accountCode: string
  accountName: string
  entryNumber: string
  reference?: string
  description?: string
  debit: number
  credit: number
  balance: number
}

// Trial Balance Types
export interface TrialBalanceEntry {
  accountId: string
  accountCode: string
  accountName: string
  accountType: string
  openingDebit: number
  openingCredit: number
  periodDebit: number
  periodCredit: number
  endingDebit: number
  endingCredit: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  pagination?: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// Filter Types
export interface AccountFilters {
  search?: string
  type?: string
  category?: string
  status?: 'all' | 'active' | 'inactive'
  dateRange?: {
    startDate?: string
    endDate?: string
  }
}

// Form Data Types
export interface AccountFormData {
  code: string
  name: string
  type: string
  category: string
  parentId?: string
  description?: string
  isActive: boolean
}
