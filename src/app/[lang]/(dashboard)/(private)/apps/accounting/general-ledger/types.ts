import { AccountType } from '@/types/apps/accounting/accountTypes'

export interface GeneralLedgerEntryType {
  id: string
  journalEntryId: string
  journalEntryReference: string
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  entryDate: Date | string
  description: string
  debit: number
  credit: number
  balance: number
  currency: string
  fiscalYear: number
  period: number
  isReconciled: boolean
  reconciledDate?: Date | string | null
  createdBy: string
  createdAt: Date | string
  updatedAt?: Date | string | null
  updatedBy?: string | null
  metadata?: Record<string, any>
}

export interface GeneralLedgerSummaryType {
  totalDebit: number
  totalCredit: number
  netBalance: number
  totalEntries: number
  startDate?: Date | string
  endDate?: Date | string
}

export interface GeneralLedgerFilterType {
  startDate?: Date | string
  endDate?: Date | string
  accountId?: string
  accountType?: AccountType
  accountCode?: string
  journalEntryId?: string
  isReconciled?: boolean
  fiscalYear?: number
  period?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface GeneralLedgerExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  includeDetails: boolean
  includeReconciled: boolean
  dateRange: {
    start: Date | string
    end: Date | string
  }
  accountTypes?: AccountType[]
}

export interface GeneralLedgerReconciliationType {
  id: string
  accountId: string
  accountName: string
  accountCode: string
  statementDate: Date | string
  statementBalance: number
  clearedBalance: number
  difference: number
  status: 'pending' | 'in_progress' | 'completed' | 'discrepancy'
  notes?: string
  reconciledBy?: string
  reconciledAt?: Date | string
  createdBy: string
  createdAt: Date | string
  updatedAt?: Date | string | null
  updatedBy?: string | null
}

export interface GeneralLedgerAccountActivityType {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  openingBalance: number
  totalDebit: number
  totalCredit: number
  endingBalance: number
  entries: Array<{
    id: string
    date: Date | string
    reference: string
    description: string
    debit: number
    credit: number
    balance: number
  }>
}

export interface GeneralLedgerTrialBalanceType {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  openingBalance: number
  debitTotal: number
  creditTotal: number
  endingBalance: number
}

export interface GeneralLedgerPeriodComparisonType {
  period: string
  startDate: Date | string
  endDate: Date | string
  totalDebit: number
  totalCredit: number
  netBalance: number
  variance: number
  variancePercentage: number
}
